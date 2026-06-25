# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# La Quesería — multi-stage, multi-target image.
#
# Targets:
#   runner   -> production web server (Next standalone, non-root)
#   migrator -> one-shot `prisma migrate deploy`
#   seeder   -> one-shot idempotent seed
#
# Base is Debian (trixie-slim), not Alpine: the app uses @node-rs/argon2 and
# the pg driver, whose prebuilt binaries target linux-x64-gnu (glibc). Alpine
# (musl) would force a slower source build or fail.
# ---------------------------------------------------------------------------

ARG NODE_IMAGE=node:24.16-trixie-slim

# --- base: shared toolchain (pnpm via corepack) -----------------------------
# No apt packages are needed: Prisma 7 uses the pg driver adapter (no native
# query engine / openssl), jose uses Node's built-in webcrypto, and argon2
# (@node-rs/argon2) ships self-contained prebuilt binaries.
FROM ${NODE_IMAGE} AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# --- deps: install with a frozen lockfile (postinstall runs prisma generate) -
FROM base AS deps
# pnpm-workspace.yaml carries onlyBuiltDependencies (pnpm 11 denies build
# scripts by default); without it sharp/esbuild/prisma builds are skipped.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- builder: compile the standalone server --------------------------------
FROM base AS builder
# DATABASE_URL is read eagerly at module load (lib/config/env.ts); a non-empty
# placeholder is enough for `next build` — no database is contacted at build.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=${DATABASE_URL} \
    NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- runner: minimal production web image (non-root) ------------------------
FROM ${NODE_IMAGE} AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
# Next standalone output bundles only the traced production dependencies.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]

# --- migrator: one-shot schema migration -----------------------------------
# Reuses the builder toolchain (prisma CLI, generated client, prisma.config.ts,
# dotenv and the migrations folder are all present).
FROM builder AS migrator
ENV NODE_ENV=production
USER node
CMD ["pnpm", "prisma:deploy"]

# --- seeder: one-shot idempotent seed ---------------------------------------
# Needs tsx + the generated client + lib/ source imported by prisma/seed.ts.
FROM builder AS seeder
ENV NODE_ENV=production
USER node
CMD ["pnpm", "db:seed"]
