FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --legacy --filter=portal --prod /prod/portal

FROM base AS portal
COPY --from=build /prod/portal /prod/portal
WORKDIR /prod/portal
EXPOSE 3000
CMD [ "pnpm", "start" ]
