# Change: La Quesería MVP

## Intent
Greenfield, production-grade MVP for La Quesería (artisanal cheese / sourdough gourmet shop, Plaza de la América Local 126, Colombia). First real floor of a future full ecommerce/admin platform — maintainable, deployable, scalable. No Supabase, no inherited tech debt.

## Scope
Public site (home, catalog, product detail, local cart + order saved to Postgres + WhatsApp deep-link, contact), minimal functional admin (auth, dashboard, product/category CRUD, orders + status, settings), Postgres+Prisma data model prepared to grow, Docker-first delivery + VPS deploy.sh + CI.

## Stack (verified-compatible, see version-decision memory)
Next 16.2.9 (App Router, standalone), React 19.2.7, TS ^5 strict, Tailwind 4, Prisma 7.8.0 (pg driver adapter), Zod 4, Zustand 5, argon2 + jose custom auth, Node 24.16, pnpm 11.7, Postgres 18-alpine.

## Key decisions
- Code in `weblaqueseria/` subfolder; local assets (DOCUMENTACION/WEB/COMERCIAL) stay out of the repo.
- TS 6 / ESLint 10 rejected — both break with Next 16 (tested). Stay on TS ^5 / ESLint ^9.
- Money: integer COP pesos in `priceCents`; `formatPriceCOP` → "$ 28.000".
- Build has no DB → every DB-reading page is `force-dynamic`.
- Deploy patterns mirrored from mediasswint (hardened compose, multi-target Dockerfile, deploy.sh with flock/backups/pg_dump/rollback).
