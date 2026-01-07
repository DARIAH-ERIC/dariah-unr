# syntax=docker/dockerfile:1-labs
# labs version is needed for `COPY --exclude`.
# @see {@link https://docs.docker.com/reference/dockerfile/#copy---exclude}

# using alpine base image to avoid `sharp` memory leaks.
# @see {@link https://sharp.pixelplumbing.com/install#linux-memory-allocator}

# build
FROM node:24-alpine AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node ./patches ./patches

ENV CI=true
ENV SKIP_INSTALL_SIMPLE_GIT_HOOKS=1

RUN pnpm fetch

COPY --chown=node:node ./ ./

ARG NEXT_PUBLIC_APP_BASE_URL
ARG NEXT_PUBLIC_APP_BOTS
ARG NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG
ARG NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL
ARG NEXT_PUBLIC_APP_MATOMO_BASE_URL
ARG NEXT_PUBLIC_APP_MATOMO_ID
ARG NEXT_PUBLIC_APP_SERVICE_ID

# disable validation for runtime environment variables
ENV ENV_VALIDATION=public

RUN pnpm install --frozen-lockfile --offline

ENV BUILD_MODE=standalone
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# to mount secrets which need to be available at build time
# @see {@link https://docs.docker.com/build/building/secrets/}
RUN pnpm run build

# serve
FROM node:24-alpine AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/next.config.ts ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
