# syntax=docker/dockerfile:1-labs
# labs version is needed for `COPY --exclude`.
# @see {@link https://docs.docker.com/reference/dockerfile/#copy---exclude}

# using alpine base image to avoid `sharp` memory leaks.
# @see {@link https://sharp.pixelplumbing.com/install#linux-memory-allocator}

# build
FROM node:24-alpine AS build

ENV PNPM_HOME="/app/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

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
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER
ARG NEXT_PUBLIC_KEYSTATIC_MODE
ARG NEXT_PUBLIC_APP_MATOMO_BASE_URL
ARG NEXT_PUBLIC_APP_MATOMO_ID
ARG NEXT_PUBLIC_APP_SENTRY_DSN
ARG NEXT_PUBLIC_APP_SENTRY_ORG
ARG NEXT_PUBLIC_APP_SENTRY_PII
ARG NEXT_PUBLIC_APP_SENTRY_PROJECT
ARG NEXT_PUBLIC_APP_SERVICE_ID

# disable validation for runtime environment variables
ENV ENV_VALIDATION=public

RUN pnpm install --frozen-lockfile --offline

ENV BUILD_MODE=standalone
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# to mount secrets which need to be available at build time
# @see {@link https://docs.docker.com/build/building/secrets/}
RUN	--mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_ID,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_SECRET,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_SECRET,uid=1000 \
			KEYSTATIC_GITHUB_CLIENT_ID=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_ID) \
			KEYSTATIC_GITHUB_CLIENT_SECRET=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_SECRET) \
			KEYSTATIC_SECRET=$(cat /run/secrets/KEYSTATIC_SECRET) \
		pnpm run build

# serve
FROM node:24-alpine AS serve

ENV PNPM_HOME="/app/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Used in entrypoint script to apply migrations.
RUN pnpm add --global drizzle-kit@beta

COPY --chown=node:node ./config/drizzle.config.ts ./config/drizzle.config.ts
COPY --chown=node:node ./db/migrations ./db/migrations

COPY --from=build --chown=node:node /app/next.config.ts ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/content ./content
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
