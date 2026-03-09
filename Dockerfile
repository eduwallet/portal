FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --legacy --filter=registration --prod /prod/registration
RUN pnpm deploy --legacy --filter=uvh-my --prod /prod/uvh-my
RUN pnpm deploy --legacy --filter=mbob-my --prod /prod/mbob-my
RUN pnpm deploy --legacy --filter=hbot-my --prod /prod/hbot-my
RUN pnpm deploy --legacy --filter=uvh-exam --prod /prod/uvh-exam
RUN pnpm deploy --legacy --filter=mbob-exam --prod /prod/mbob-exam
RUN pnpm deploy --legacy --filter=hbot-exam --prod /prod/hbot-exam
RUN pnpm deploy --legacy --filter=movm-vacancies --prod /prod/movm-vacancies
RUN pnpm deploy --legacy --filter=home --prod /prod/home
RUN pnpm deploy --legacy --filter=portal --prod /prod/portal

FROM base AS registration
COPY --from=build /prod/registration /prod/registration
WORKDIR /prod/registration
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS uvh-my
COPY --from=build /prod/uvh-my /prod/uvh-my
WORKDIR /prod/uvh-my
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS mbob-my
COPY --from=build /prod/mbob-my /prod/mbob-my
WORKDIR /prod/mbob-my
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS hbot-my
COPY --from=build /prod/hbot-my /prod/hbot-my
WORKDIR /prod/hbot-my
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS uvh-exam
COPY --from=build /prod/uvh-exam /prod/uvh-exam
WORKDIR /prod/uvh-exam
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS mbob-exam
COPY --from=build /prod/mbob-exam /prod/mbob-exam
WORKDIR /prod/mbob-exam
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS hbot-exam
COPY --from=build /prod/hbot-exam /prod/hbot-exam
WORKDIR /prod/hbot-exam
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS movm-vacancies
COPY --from=build /prod/movm-vacancies /prod/movm-vacancies
WORKDIR /prod/movm-vacancies
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS home
COPY --from=build /prod/home /prod/home
WORKDIR /prod/home
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS portal
COPY --from=build /prod/portal /prod/portal
WORKDIR /prod/portal
EXPOSE 3000
CMD [ "pnpm", "start" ]
