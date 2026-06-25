# RESUME — La Quesería MVP

**When you say "retomemos el proyecto", we continue from HERE.**

## Safe point
- Last safe commit: `0f10f9e` (working tree clean). Nothing lost on power-off.
- All green: `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- Repo root: `weblaqueseria/` (this folder). GitHub: https://github.com/sebasttiant/weblaqueseria.git (not pushed yet).

## Done
1. Foundation (Next 16.2.9, TS5, Tailwind 4, env/auth helpers, standalone)
2. Data (Prisma 7 schema + seed + pg adapter client)
3. Public site (home, catálogo, detalle, carrito/pedido→Postgres+WhatsApp, contacto, SEO)
4. Admin + Auth (argon2/jose cookie, middleware, dashboard, CRUD productos/categorías, pedidos+estado, ajustes)

## Next (Layer 5 — Docker/VPS/CI), then Layer 6 (Verification)
See `openspec/changes/laqueseria-mvp/tasks.md` for the full checklist and known fixes.
- Dockerfile multi-target + hardened docker-compose (postgres 18-alpine, migrate, seed, web/healthcheck)
- `deploy.sh` (flock, backups/pg_dump, git pull --ff-only, build, migrate, healthcheck, rollback) — patterns from mediasswint
- CI (pnpm frozen, prisma validate/generate, lint, typecheck, build, docker build) + README
- Create initial Prisma migration against real Postgres, `docker compose up --build`, smoke test, push to GitHub

## Quick start when resuming (local, needs Docker for full run)
```
cd weblaqueseria
pnpm install
# (Layer 5 will add docker compose + migrations; for now build works without DB)
DATABASE_URL=postgresql://ci:ci@localhost:5432/ci pnpm build
```

## Known fixes to apply on resume
- `lib/data/settings.ts` reads camelCase keys but seed writes snake_case → align (public site falls back to defaults until fixed).
- Decide `middleware.ts` → `proxy.ts` (Next 16 deprecation warning).
