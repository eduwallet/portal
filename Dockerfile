# ----------------------------
# 1️⃣  Builder stage
# ----------------------------
FROM cgr.dev/chainguard/node:latest-dev AS builder

USER root
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    PNPM_STORE_PATH="/pnpm/store"
RUN mkdir -p /pnpm/store && chown -R node:node /pnpm
RUN npm install -g pnpm@10

USER node
WORKDIR /workspace

COPY --chown=node:node . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=65532,gid=65532 \
    pnpm install --frozen-lockfile

RUN pnpm run build

# ----------------------------
# 2️⃣  Runtime stage
# ----------------------------
FROM cgr.dev/chainguard/node:latest AS portal

USER node
WORKDIR /app

# Nuxt 3 / Nitro output is fully self-contained — no pnpm deploy needed.
# .output/server/ includes its own bundled node_modules.
COPY --from=builder --chown=node:node /workspace/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
# Node.js v22+ ships localStorage as a global stub; without --localstorage-file
# the object exists but methods throw, crashing @vue/devtools-kit at SSR init.
ENV NODE_OPTIONS="--no-experimental-webstorage"

EXPOSE 3000

# Chainguard node:latest ENTRYPOINT is /usr/bin/node — pass script as CMD
CMD [".output/server/index.mjs"]
