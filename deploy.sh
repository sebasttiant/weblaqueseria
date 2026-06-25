#!/usr/bin/env bash
#
# deploy.sh — zero-drama VPS deploy for La Quesería.
#
# Flow: lock -> preflight -> backup (db + .env + manifest) -> git pull
#       -> build -> migrate -> [seed] -> web up -> healthcheck.
# On any failure after the safe point, it rolls the code back to the previous
# commit and restarts. The database dump is kept for manual restore (data is
# never auto-rolled-back — that is a deliberate, human decision).
#
# Seeding is OFF by default so a deploy can never mutate data or admin
# credentials unintentionally. Opt in explicitly:
#
# Usage:  ./deploy.sh                     # pull + migrate + web (no seed)
#         ./deploy.sh --no-pull           # deploy current checkout (no git pull)
#         ./deploy.sh --seed              # also run the idempotent seed
#         ./deploy.sh --bootstrap-admin   # seed + require ADMIN_EMAIL/PASSWORD
#         ./deploy.sh --force-admin-reset # bootstrap + reset existing admin pwd
#
# Admin creds (ADMIN_EMAIL / ADMIN_PASSWORD) live ONLY in .env / VPS secrets,
# never in committed files. No secrets are ever printed to stdout.

set -Eeuo pipefail

# --- configuration ----------------------------------------------------------
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

readonly ENV_FILE="${ENV_FILE:-.env}"
readonly BACKUP_DIR="${BACKUP_DIR:-backups}"
readonly LOCK_FILE="${LOCK_FILE:-/tmp/laqueseria-deploy.lock}"
readonly KEEP_BACKUPS="${KEEP_BACKUPS:-7}"
readonly HEALTH_PATH="/api/health"
readonly HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
readonly HEALTH_INTERVAL="${HEALTH_INTERVAL:-3}"

DO_PULL=1
DO_SEED=0
DO_BOOTSTRAP_ADMIN=0
FORCE_ADMIN_RESET=0
for arg in "$@"; do
  case "$arg" in
    --no-pull) DO_PULL=0 ;;
    --seed) DO_SEED=1 ;;
    --bootstrap-admin) DO_SEED=1; DO_BOOTSTRAP_ADMIN=1 ;;
    --force-admin-reset) DO_SEED=1; DO_BOOTSTRAP_ADMIN=1; FORCE_ADMIN_RESET=1 ;;
    -h|--help) sed -n '2,28p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; exit 2 ;;
  esac
done

# --- logging ----------------------------------------------------------------
log()  { printf '\033[0;36m[deploy]\033[0m %s\n' "$*"; }
ok()   { printf '\033[0;32m[ ok  ]\033[0m %s\n' "$*"; }
warn() { printf '\033[0;33m[warn ]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[0;31m[fail ]\033[0m %s\n' "$*" >&2; exit 1; }

# --- docker compose shim (v2 plugin or legacy binary) -----------------------
if docker compose version >/dev/null 2>&1; then
  dc() { docker compose "$@"; }
elif command -v docker-compose >/dev/null 2>&1; then
  dc() { docker-compose "$@"; }
else
  die "docker compose is not available"
fi

# --- placeholder denylist ---------------------------------------------------
# Known example/placeholder secrets that must never reach production. Kept in
# sync with prisma/seed.ts. Matched case-insensitively. Values are never echoed.
readonly PLACEHOLDER_VALUES=(
  "change-me-locally"
  "change-this-securely"
  "replace-with-a-strong-password"
  "replace-with-a-32-plus-character-secret"
  "replace-with-admin-email@example.com"
  "admin@laqueseria.co"
  "admin@example.com"
  "password"
  "changeme"
  "admin"
)

is_placeholder() {
  local value; value="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"
  # Every shipped .env.example placeholder carries the "replace-with" marker.
  case "$value" in
    *replace-with*) return 0 ;;
  esac
  local candidate
  for candidate in "${PLACEHOLDER_VALUES[@]}"; do
    [ "$value" = "$candidate" ] && return 0
  done
  return 1
}

# Read a key's value from the env file without printing it.
env_value() {
  grep -E "^$1=" "$ENV_FILE" | head -n1 | cut -d= -f2-
}

# --- preflight --------------------------------------------------------------
preflight() {
  command -v docker >/dev/null 2>&1 || die "docker is not installed"
  command -v git   >/dev/null 2>&1 || die "git is not installed"
  command -v flock >/dev/null 2>&1 || die "flock is not installed (util-linux)"
  [ -f "$ENV_FILE" ] || die "missing $ENV_FILE — copy .env.example and fill it in"
  docker info >/dev/null 2>&1 || die "cannot talk to the docker daemon"
  # Required keys must exist and be non-empty (values are never printed).
  for key in POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB AUTH_SECRET; do
    if ! grep -qE "^${key}=.+" "$ENV_FILE"; then
      die "$ENV_FILE is missing a non-empty $key"
    fi
  done

  # Core production secrets must not be left at placeholder/example values.
  # NEXT_PUBLIC_SITE_URL is optional (compose defaults it), so it is only
  # checked when present. Values are never printed.
  local value
  for key in POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB AUTH_SECRET NEXT_PUBLIC_SITE_URL; do
    value="$(env_value "$key")"
    if [ -n "$value" ] && is_placeholder "$value"; then
      die "$key in $ENV_FILE is still a placeholder/example value — set a real one"
    fi
  done

  # AUTH_SECRET strength: jose signing key must be at least 32 chars.
  local auth_secret; auth_secret="$(env_value AUTH_SECRET)"
  if [ "${#auth_secret}" -lt 32 ]; then
    die "AUTH_SECRET must be at least 32 characters"
  fi

  # Admin bootstrap must fail fast (before any change) when creds are missing
  # OR still set to a known placeholder/example value.
  if [ "$DO_BOOTSTRAP_ADMIN" -eq 1 ]; then
    for key in ADMIN_EMAIL ADMIN_PASSWORD; do
      if ! grep -qE "^${key}=.+" "$ENV_FILE"; then
        die "--bootstrap-admin requires a non-empty $key in $ENV_FILE"
      fi
    done
    local admin_email admin_password
    admin_email="$(env_value ADMIN_EMAIL)"
    admin_password="$(env_value ADMIN_PASSWORD)"
    if is_placeholder "$admin_email"; then
      die "--bootstrap-admin: ADMIN_EMAIL is still a placeholder — set a real email in $ENV_FILE"
    fi
    if is_placeholder "$admin_password"; then
      die "--bootstrap-admin: ADMIN_PASSWORD is still a placeholder — set a real secret in $ENV_FILE"
    fi
    if [ "${#admin_password}" -lt 8 ]; then
      die "--bootstrap-admin: ADMIN_PASSWORD must be at least 8 characters"
    fi
  fi

  # The rollback path uses `git reset --hard`; refuse to run on a dirty tree so
  # uncommitted local work can never be destroyed by a rollback.
  if ! git diff --quiet || ! git diff --cached --quiet; then
    die "working tree is dirty — commit/stash changes before deploying (rollback uses git reset --hard)"
  fi
  ok "preflight passed"
}

# --- backup -----------------------------------------------------------------
GIT_BEFORE=""
BACKUP_PATH=""

backup() {
  GIT_BEFORE="$(git rev-parse HEAD)"
  local stamp; stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  BACKUP_PATH="${BACKUP_DIR}/${stamp}"
  mkdir -p "$BACKUP_PATH"

  # Database dump (only if the db service is already running).
  if dc ps --status running db 2>/dev/null | grep -q db; then
    log "dumping database…"
    # shellcheck disable=SC1090
    set -a; . "$ENV_FILE"; set +a
    if dc exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
        | gzip > "${BACKUP_PATH}/db.sql.gz"; then
      ok "database dump saved"
    else
      warn "pg_dump failed — continuing without a fresh dump"
      rm -f "${BACKUP_PATH}/db.sql.gz"
    fi
  else
    log "db service not running — skipping dump (first deploy?)"
  fi

  cp "$ENV_FILE" "${BACKUP_PATH}/env.backup"
  chmod 600 "${BACKUP_PATH}/env.backup"

  cat > "${BACKUP_PATH}/manifest.txt" <<EOF
created_utc=${stamp}
git_before=${GIT_BEFORE}
git_branch=$(git rev-parse --abbrev-ref HEAD)
host=$(hostname)
EOF
  ok "backup ready at ${BACKUP_PATH}"
}

# --- rollback (code only) ---------------------------------------------------
rollback() {
  [ -n "$GIT_BEFORE" ] || { warn "no safe commit recorded — cannot roll back"; return; }
  # Never destroy uncommitted work. Preflight already enforced a clean tree,
  # but re-check here: if something dirtied it mid-deploy, skip the hard reset.
  if ! git diff --quiet || ! git diff --cached --quiet; then
    warn "working tree is dirty — skipping 'git reset --hard' to avoid data loss"
    warn "still on $(git rev-parse --short HEAD); resolve manually (was ${GIT_BEFORE})"
    return
  fi
  warn "rolling code back to ${GIT_BEFORE}"
  git reset --hard "$GIT_BEFORE" || warn "git reset failed"
  if dc up -d --build web; then
    warn "rolled back and web restarted from ${GIT_BEFORE}"
  else
    warn "rollback restart failed — manual intervention required"
  fi
  [ -n "$BACKUP_PATH" ] && warn "DB dump (manual restore if needed): ${BACKUP_PATH}/db.sql.gz"
}

on_error() {
  local code=$?
  warn "deploy failed (exit ${code})"
  rollback
  exit "$code"
}

# --- healthcheck ------------------------------------------------------------
wait_for_health() {
  local port; port="$(grep -E '^WEB_PORT=' "$ENV_FILE" | cut -d= -f2)"
  port="${port:-3000}"
  local url="http://127.0.0.1:${port}${HEALTH_PATH}"
  log "waiting for ${url}…"
  for ((i = 1; i <= HEALTH_RETRIES; i++)); do
    if curl -fsS -o /dev/null "$url" 2>/dev/null; then
      ok "web is healthy"
      return 0
    fi
    sleep "$HEALTH_INTERVAL"
  done
  die "web did not become healthy after $((HEALTH_RETRIES * HEALTH_INTERVAL))s"
}

# --- cleanup ----------------------------------------------------------------
cleanup_backups() {
  [ -d "$BACKUP_DIR" ] || return 0
  # Keep the newest $KEEP_BACKUPS directories, prune the rest.
  local old
  old="$(ls -1dt "${BACKUP_DIR}"/*/ 2>/dev/null | tail -n +$((KEEP_BACKUPS + 1)) || true)"
  if [ -n "$old" ]; then
    echo "$old" | xargs -r rm -rf
    ok "pruned old backups (kept ${KEEP_BACKUPS})"
  fi
}

# --- main -------------------------------------------------------------------
main() {
  log "acquiring deploy lock…"
  exec 9>"$LOCK_FILE"
  flock -n 9 || die "another deploy is already running"

  preflight
  backup

  # From here on, any failure triggers a code rollback.
  trap on_error ERR

  if [ "$DO_PULL" -eq 1 ]; then
    log "git pull --ff-only…"
    git pull --ff-only
  else
    log "skipping git pull (--no-pull)"
  fi

  log "building images…"
  dc build

  log "running migrations…"
  dc run --rm migrate

  if [ "$DO_SEED" -eq 1 ]; then
    if [ "$FORCE_ADMIN_RESET" -eq 1 ]; then
      export FORCE_ADMIN_PASSWORD_RESET=1
      log "seeding + admin bootstrap (FORCING admin password reset)…"
    elif [ "$DO_BOOTSTRAP_ADMIN" -eq 1 ]; then
      log "seeding + admin bootstrap (create-only, no reset)…"
    else
      log "seeding (idempotent; admin bootstrapped only if creds present)…"
    fi
    # Compose auto-loads .env for ${ADMIN_EMAIL}/${ADMIN_PASSWORD} interpolation.
    # `run` starts only the seed one-shot (plus its db/migrate deps), never web.
    dc run --rm seed
  else
    log "skipping seed (default — pass --seed or --bootstrap-admin to enable)"
  fi

  log "starting web…"
  dc up -d db web

  wait_for_health

  trap - ERR
  cleanup_backups
  ok "deploy complete — now on $(git rev-parse --short HEAD)"
}

# Run main only when executed directly (sourcing for tests leaves it inert).
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  main "$@"
fi
