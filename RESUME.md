# RESUME — La Quesería MVP

**When you say "retomemos el proyecto", we continue from HERE.**

## Status: MVP COMPLETE and Docker-verified

All six layers are done. The full stack runs in Docker end-to-end.

## Done
1. Foundation (Next 16.2.9, TS5, Tailwind 4, env/auth helpers, standalone)
2. Data (Prisma 7 schema + seed + pg adapter client) + initial migration `20260625204149_init`
3. Public site (home, catálogo, detalle, carrito/pedido→Postgres+WhatsApp, contacto, SEO)
4. Admin + Auth (argon2/jose cookie, proxy gate, dashboard, CRUD productos/categorías, pedidos+estado, ajustes)
5. Docker/VPS/CI: multi-target Dockerfile, hardened docker-compose, `deploy.sh`, CI (ci-pr/ci-main), README
6. Verification: migration created + verified on fresh DB; live stack smoke test → `/api/health` 200, `GET /` 200

## Verified gates (all green)
- `pnpm lint`, `pnpm typecheck`, `pnpm build`
- `pnpm prisma:validate` (needs DATABASE_URL set, as in CI)
- `docker build` runner/migrator/seeder; `docker compose config` valid
- Live Docker smoke: postgres → migrator → seeder → web, health 200

## Security model (admin + seeding)
- Admin creds come ONLY from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env (never committed).
- Admin is create-only; existing password is never reset unless `FORCE_ADMIN_PASSWORD_RESET=1`.
- Seeding is OFF by default in `deploy.sh`; the `seed` compose service is behind the `seed` profile.
- Settings seed is create-only (won't clobber operator edits).

## Deploy (on the VPS)
```
cd weblaqueseria
cp .env.example .env   # then fill in real values (see README env table)
./deploy.sh                     # pull + migrate + web (no seed)
./deploy.sh --bootstrap-admin   # first time: also create the admin (needs ADMIN_* in .env)
```

## Remaining
- Add the git remote and push so CI runs (no remote is configured in this clone):
  ```
  git remote add origin https://github.com/sebasttiant/weblaqueseria.git
  git push -u origin main
  ```

## Known non-blocking notes
- Product images are text-URL only (MVP scope).
- migrator/seeder images ~1.5GB (FROM builder) — fine for one-shot jobs.
- `.env*` files are blocked by local permissions here; the README carries the env template with placeholders.
