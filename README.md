# La Quesería

Production website + admin for an artisanal cheese & sourdough gourmet shop.
Página web y ecommerce para La Quesería Plaza La América.
"Todo comenzó con una Cuajada."

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Prisma 7 +
PostgreSQL · Zod 4 · Zustand 5 · argon2 + jose cookie auth. Docker-first,
deployable on a single VPS.

---

## Requirements

- Node `>=24.16 <25` and pnpm `>=11.7 <12` (for local dev)
- Docker + Docker Compose v2 (for the full stack and deploy)

---

## Environment

Copy the template below into `.env` (this repo ignores `.env*` except the
example, and the file is intentionally git-ignored):

```dotenv
# Placeholders only — replace EVERY value with a real secret. Never commit .env.

# --- Postgres (compose `db` service) ---
POSTGRES_USER=replace-with-db-user
POSTGRES_PASSWORD=replace-with-a-strong-db-password
POSTGRES_DB=replace-with-db-name

# --- App ---
# Session cookie secret (jose). MUST be >= 32 chars. Generate:
#   openssl rand -base64 48
AUTH_SECRET=replace-with-a-32-plus-character-secret

# Canonical public URL (SEO metadata / sitemap / robots). Production MUST be the
# real domain — deploy.sh rejects localhost/127.0.0.1. Local dev: http://localhost:3000.
NEXT_PUBLIC_SITE_URL=replace-with-production-url

# Host port the web container publishes (container always listens on 3000).
WEB_PORT=3000

# --- Admin bootstrap (only read when seeding / --bootstrap-admin) ---
# No committed defaults. deploy.sh and the seed reject known placeholder values.
ADMIN_EMAIL=replace-with-admin-email@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

> Both `deploy.sh --bootstrap-admin` and the seed **reject** these placeholder
> values (and other obvious examples) — a real deploy must supply genuine
> secrets.

| Variable               | Used by            | Notes                                                        |
| ---------------------- | ------------------ | ------------------------------------------------------------ |
| `POSTGRES_USER`        | db, app            | Database role.                                               |
| `POSTGRES_PASSWORD`    | db, app            | Use a strong value.                                          |
| `POSTGRES_DB`          | db, app            | Database name.                                               |
| `AUTH_SECRET`          | web                | Min 32 chars. Validated lazily server-side.                  |
| `NEXT_PUBLIC_SITE_URL` | web (build/run)    | Canonical URL (SEO/sitemap/robots). Prod: real domain — deploy.sh rejects localhost. |
| `WEB_PORT`             | web                | Host port → container `3000`. Defaults to `3000`.            |
| `ADMIN_EMAIL`          | seed only          | Initial admin email. No committed default.                   |
| `ADMIN_PASSWORD`       | seed only          | Initial admin password (min 8 chars). No committed default.  |
| `FORCE_ADMIN_PASSWORD_RESET` | seed only    | Set to `1` to reset an existing admin's password. Off otherwise. |
| `DATABASE_URL`         | local scripts only | Inside compose it is derived from `POSTGRES_*` (host `db`).  |

Inside Docker Compose, `DATABASE_URL` is built automatically as
`postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB` — you do
**not** set it in `.env`. Set it only when running the app or Prisma scripts
directly on the host.

---

## Local development

```bash
pnpm install
# Point DATABASE_URL at a local Postgres, then:
pnpm prisma:migrate:dev   # create/apply migrations
# Generic seed (categories, settings, samples). Set ADMIN_EMAIL/ADMIN_PASSWORD
# to also bootstrap the admin; without them admin bootstrap is skipped.
pnpm db:seed
pnpm dev                  # http://localhost:3000
```

Quality gates (run before pushing):

```bash
pnpm lint && pnpm typecheck && pnpm build
```

> `next build` validates `DATABASE_URL` eagerly but never contacts the
> database. A placeholder is enough:
> `DATABASE_URL=postgresql://ci:ci@localhost:5432/ci pnpm build`.

---

## Run locally (Docker) — one command

```bash
cp .env.example .env     # then fill in real values (see the env table above)
docker compose up -d --build
```

That's it. Compose builds and starts the whole stack in order:
`db` (healthy) → `migrate` (applies migrations, exits) → `seed` (populates data,
exits) → `web`.

- Web: `http://localhost:${WEB_PORT:-3000}`
- Health probe: `GET /api/health` → `200 {status:"ok",db:"up"}` (`503` if the DB is down)
- `migrate` and `seed` are one-shot services (they run once and exit). `web`
  starts after migrations complete.
- To get an **admin login locally**, set real `ADMIN_EMAIL` / `ADMIN_PASSWORD`
  in `.env` (not placeholders — they are rejected). Otherwise the generic seed
  still runs and admin bootstrap is simply skipped.

Image targets (`Dockerfile`): `runner` (web), `migrator`
(`prisma migrate deploy`), `seeder` (idempotent seed + admin bootstrap).

### Seeding & admin bootstrap (security)

The seed has two concerns:

- **Generic data** (categories, products, settings) — idempotent and safe to
  run repeatedly. Existing `settings` are **never overwritten** (operators edit
  them from the admin panel), and categories/products are upserted.
- **Admin bootstrap** — reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from the
  environment. There are **no committed default credentials**, and known
  placeholder values are **rejected**. Behavior:
  - creds not set → admin bootstrap is **skipped** (generic seed still runs);
  - admin does not exist → it is **created**;
  - admin exists → password is **left unchanged**, unless
    `FORCE_ADMIN_PASSWORD_RESET=1` is explicitly provided.

Re-run the seed manually any time (creds come from `.env`):

```bash
docker compose run --rm seed
```

> **Local vs production**: locally, `docker compose up` runs the seed for
> convenience. On a VPS, `deploy.sh` brings up only `db` + `web`, so a deploy
> **never** seeds or touches the admin unless you pass `--seed` /
> `--bootstrap-admin`.

---

## VPS deploy

`deploy.sh` performs a locked, backed-up, self-rolling-back deploy.

```bash
./deploy.sh                     # pull + migrate + web  (NO seed by default)
./deploy.sh --no-pull           # deploy the current checkout (skip git pull)
./deploy.sh --seed              # also run the idempotent seed
./deploy.sh --bootstrap-admin   # seed + require ADMIN_EMAIL/ADMIN_PASSWORD
./deploy.sh --force-admin-reset # bootstrap and reset the existing admin password
```

Seeding is **off by default**: a routine deploy never touches data or admin
credentials. `--bootstrap-admin` fails fast (before any change) if
`ADMIN_EMAIL`/`ADMIN_PASSWORD` are missing from `.env`.

What it does, in order:

1. **Lock** with `flock` so two deploys never overlap.
2. **Preflight**: docker daemon, git, flock, a complete `.env`, a **clean
   working tree** (the rollback uses `git reset --hard`), and — for
   `--bootstrap-admin` — the admin credentials.
3. **Backup**: `pg_dump` (gzipped) + a copy of `.env` + a `manifest.txt`
   recording `git_before`, branch, and host, under `backups/<UTC-timestamp>/`.
4. **Pull** `git pull --ff-only` (unless `--no-pull`).
5. **Build** images, **migrate**, optionally **seed** (only with `--seed` /
   `--bootstrap-admin`), bring **web** up.
6. **Healthcheck** `/api/health` until it returns `200`.
7. On success, **prune** old backups (keeps `KEEP_BACKUPS`, default 7).

### Rollback

If any step after the safe point fails, `deploy.sh` resets the code to the
previous commit (`git_before`) and restarts `web` — but only if the working
tree is clean; a dirty tree skips the destructive reset to protect uncommitted
work. The database is **not** auto-rolled-back — that is a deliberate human
decision. Restore data manually from the dump when needed:

```bash
gunzip -c backups/<timestamp>/db.sql.gz \
  | docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

Tunable env knobs: `KEEP_BACKUPS`, `HEALTH_RETRIES`, `HEALTH_INTERVAL`,
`BACKUP_DIR`, `ENV_FILE`, `LOCK_FILE`.

---

## CI

- `.github/workflows/ci-pr.yml` — on PRs to `main`.
- `.github/workflows/ci-main.yml` — on push to `main`.

Both run: frozen-lockfile install, `pnpm audit`, Prisma validate/generate,
lint, typecheck, build, and a Docker image build (with GHA layer cache).

---

## Project layout

```
app/                 App Router routes (public + /admin)
components/          UI (layout, admin, product, cart…)
lib/                 config, data access, server actions, auth, db, utils
prisma/              schema.prisma, seed.ts, migrations/
proxy.ts             Next 16 proxy (admin route gate, replaces middleware.ts)
Dockerfile           multi-target: runner / migrator / seeder
docker-compose.yml   hardened db + migrate + seed + web
deploy.sh            locked, backed-up, self-rolling-back VPS deploy
```
