# ─────────────────────────────────────────────────────
# 1️⃣  Builder stage
# ─────────────────────────────────────────────────────
FROM node:24-alpine AS builder

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    PNPM_STORE_PATH="/pnpm/store"
RUN corepack enable && corepack prepare pnpm@10.6.4 --activate

WORKDIR /workspace

# ── Phase 1: manifests only ──────────────────────────
# Copy all package.json + workspace config before source.
# As long as dependencies don't change, `pnpm install` is fully cached.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Shared base layer + feature layers
COPY base/package.json              ./base/

# App manifests
COPY apps/portal/package.json         ./apps/portal/

RUN --mount=type=cache,id=pnpm-portal,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ── Phase 2: source ──────────────────────────────────
# Invalidates the build step on source changes,
# but the install layer above stays cached.
COPY . .

RUN pnpm run build

# Fill missing transitive deps of Nitro-externalised packages.
# Nitro's tracer misses some transitive deps (e.g. @unhead/shared);
# this script copies only what's missing into each app's .output/server/node_modules/.
RUN for app in apps/portal ; do \
      (cd $app && node /workspace/scripts/fill-externals.mjs) ; \
    done

# ─────────────────────────────────────────────────────
# 2️⃣  Runtime stages — one per app
# Each copies only its own .output/ (~30–60 MB compressed).
# ─────────────────────────────────────────────────────

FROM gcr.io/distroless/nodejs24-debian12:nonroot AS portal
WORKDIR /app
COPY --from=builder --chown=65532:65532 /workspace/apps/portal/.output ./.output
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD [".output/server/index.mjs"]
