# Tasks — La Quesería MVP

## Done (committed, all green: typecheck/lint/build)
- [x] Layer 1 — Foundation: Next 16 + TS5 + Tailwind 4, configs, env validation (zod), auth primitives (argon2/jose), money/cn helpers, standalone output
- [x] Layer 2 — Data: Prisma 7 schema (User, Category, Product, Order, OrderItem, Setting, InventoryMovement), prisma.config.ts, pg adapter client, idempotent seed (categories, settings, admin, sample products)
- [x] Layer 3 — Public site: home (hero/featured/categories/story/diff/location), catalog + filters + search, product detail + metadata, cart (Zustand) + checkout server action (saves Order + WhatsApp deep-link), contacto, SEO/sitemap/robots
- [x] Layer 4 — Admin + Auth: custom login (argon2/jose httpOnly cookie), middleware edge gate, requireAdmin defense-in-depth, admin shell, dashboard, product CRUD, category CRUD, orders list/detail + status change, settings editor

## Remaining (RESUME HERE)
- [ ] Layer 5 — Docker/VPS/CI:
  - [ ] Dockerfile multi-stage/multi-target (deps, builder, runner standalone non-root; migrator target running `prisma migrate deploy`; seeder target). Base node:24.16-trixie-slim, pnpm 11.7 via corepack.
  - [ ] docker-compose.yml hardened (postgres 18-alpine + volume, migrate service w/ marker, seed one-shot, web w/ healthcheck to /api/health). Mirror mediasswint patterns (read_only, cap_drop, no-new-privileges, healthchecks, logging limits) adapted (NO redis).
  - [ ] .env handling for compose, scripts/ for migrate+seed
  - [ ] deploy.sh (flock lock, preflight, pg_dump + .env + volume backups + manifest w/ git_before, git pull --ff-only, build, migrate via service, seed, web up, healthcheck /api/health, rollback to prev commit, cleanup old backups, set -Eeuo pipefail, no secrets in stdout) — per the detailed deploy.sh spec
  - [ ] CI workflows (ci-pr, ci-main): pnpm frozen-lockfile, audit, prisma validate/generate, lint, typecheck, build, docker build. Single-package (no --filter). Optional gitleaks/codeql.
  - [ ] README (local dev flow + VPS deploy + env vars + rollback notes)
- [ ] Layer 6 — Verification:
  - [ ] Create initial Prisma migration (needs Postgres up): `pnpm prisma migrate dev --name init`
  - [ ] Run `docker compose up --build`, apply migrations, run seed, smoke-test public + admin + /api/health
  - [ ] Final: pnpm lint && pnpm typecheck && pnpm build && docker compose build
- [ ] Push to GitHub: remote https://github.com/sebasttiant/weblaqueseria.git (first push of branch main)

## Known issues to fix on resume
- [ ] BUG: `lib/data/settings.ts` (public) reads camelCase keys (whatsappDisplay, heroTitle) but seed writes snake_case (whatsapp_display, hero_title) → public site always falls back to SITE defaults. Align keys (admin ajustes already uses snake_case). Quick fix.
- [ ] Next 16 prints deprecation: rename `middleware.ts` → `proxy.ts` (warning only; decide on resume).
- [ ] Product images are text-URL only (no upload infra) — intended for MVP; future: object storage.
