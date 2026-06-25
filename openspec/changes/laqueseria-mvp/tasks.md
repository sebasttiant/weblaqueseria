# Tasks — La Quesería MVP

## Done (committed, all green: typecheck/lint/build)
- [x] Layer 1 — Foundation: Next 16 + TS5 + Tailwind 4, configs, env validation (zod), auth primitives (argon2/jose), money/cn helpers, standalone output
- [x] Layer 2 — Data: Prisma 7 schema (User, Category, Product, Order, OrderItem, Setting, InventoryMovement), prisma.config.ts, pg adapter client, idempotent seed (categories, settings, admin, sample products)
- [x] Layer 3 — Public site: home (hero/featured/categories/story/diff/location), catalog + filters + search, product detail + metadata, cart (Zustand) + checkout server action (saves Order + WhatsApp deep-link), contacto, SEO/sitemap/robots
- [x] Layer 4 — Admin + Auth: custom login (argon2/jose httpOnly cookie), middleware edge gate, requireAdmin defense-in-depth, admin shell, dashboard, product CRUD, category CRUD, orders list/detail + status change, settings editor

## Layer 5 — Docker/VPS/CI (DONE)
- [x] Dockerfile multi-stage/multi-target (deps, builder, runner standalone non-root; migrator target `prisma migrate deploy`; seeder target). Base node:24.16-trixie-slim, pnpm 11.7 via corepack. No apt packages (Prisma driver adapter needs no openssl; jose uses Node webcrypto; argon2 prebuilt).
- [x] docker-compose.yml hardened (postgres 18-alpine + volume, migrate one-shot via service_completed_successfully, seed one-shot behind `seed` profile, web w/ healthcheck to /api/health). read_only, cap_drop, no-new-privileges, tmpfs, logging limits. NO redis.
- [x] deploy.sh (flock, preflight, pg_dump + .env + manifest w/ git_before, git pull --ff-only, build, migrate, opt-in seed, web up, healthcheck, guarded rollback, backup cleanup, set -Eeuo pipefail, no secrets in stdout).
- [x] CI workflows (ci-pr, ci-main): pnpm frozen-lockfile, blocking audit, prisma validate/generate, lint, typecheck, build, docker build. Single-package.
- [x] README (local dev + VPS deploy + env vars + seeding/admin security + rollback notes).

## Layer 6 — Verification (DONE)
- [x] Initial Prisma migration created: `prisma/migrations/20260625204149_init`. `prisma migrate deploy` verified on a fresh DB.
- [x] Full Docker stack smoke-tested: postgres → migrator → seeder → web; `/api/health` 200 `{db:"up"}`, `GET / ` 200.
- [x] Final gates green: lint, typecheck, build; docker build (runner/migrator/seeder).

## Security hardening (DONE — per follow-up spec)
- [x] Admin bootstrap: no committed default creds; requires ADMIN_EMAIL/ADMIN_PASSWORD; create-only; never resets existing password unless FORCE_ADMIN_PASSWORD_RESET=1. Validated all 4 behaviors against a live DB.
- [x] Settings seed is create-only (never overwrites operator-edited values).
- [x] compose seed service passes admin creds from env, behind `seed` profile.
- [x] deploy.sh: seeding off by default; `--seed` / `--bootstrap-admin` opt-in; fail-fast on missing creds; clean-tree preflight guards `git reset --hard`.
- [x] CI audit no longer has `|| true` (high-severity findings block).
- [x] dotenv added as a real dependency (prisma.config.ts/seed.ts import it); pnpm `allowBuilds` (not `onlyBuiltDependencies`) is the key pnpm 11.7 enforces.

## Remaining
- [ ] Push to GitHub (no git remote configured in this clone; was https://github.com/sebasttiant/weblaqueseria.git).

## Fixed bugs
- [x] `lib/data/settings.ts` now reads snake_case keys (whatsapp_display, hero_title, hero_subtitle) → admin-edited settings reach the public site.
- [x] `middleware.ts` → `proxy.ts` (Next 16). Proxy runtime is nodejs; fine since the gate only verifies a jose JWT.

## Known non-blocking notes
- Product images are text-URL only (no upload infra) — intended for MVP; future: object storage.
- migrator/seeder images are ~1.5GB (FROM builder) — fine for one-shot jobs; could be slimmed later.
