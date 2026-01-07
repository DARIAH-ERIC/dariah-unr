# development documentation

## prerequisites

- [node.js v24](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 24 --global`

## environment variables

set required environment variables in `.env.local`. start by copying the example file:

```bash
cp .env.local.example .env.local
```

| environment variable                     | required | default    | description                    |
| ---------------------------------------- | -------- | ---------- | ------------------------------ |
| NEXT_PUBLIC_APP_BASE_URL                 | true     |            | deployment base url            |
| NEXT_PUBLIC_APP_BOTS                     | true     | "disabled" | indexing by web crawlers       |
| NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION | false    |            | google search console property |
| NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG    | true     |            | acdh custom imprint config     |
| NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL | true     |            | acdh imprint service base url  |
| NEXT_PUBLIC_APP_MATOMO_BASE_URL          | false    |            | acdh matomo analytics base url |
| NEXT_PUBLIC_APP_MATOMO_ID                | false    |            | acdh matomo analytics id       |
| NEXT_PUBLIC_APP_SERVICE_ID               | true     |            | acdh service id                |

environment variables are validated in [`config/env.config.ts`](./config/env.config.ts). when adding
new environment variables, don't forget to add them to [`.env.local.example`](./.env.local.example)
and [`config/env.config.ts`](./config/env.config.ts) as well.

public environment variables, which should be included in the client javascript bundle at build
time, need to be
[prefixed with `NEXT_PUBLIC_`](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser)
and set as build args in `Dockerfile` as well as the github workflows in
[`./.github/workflows/validate.yaml`](.github/workflows/validate.yaml) and
[`./.github/workflows/build-deploy.yaml`](.github/workflows/build-deploy.yaml).

secrets, which need to be available at runtime, can be set as
[github repository secrets](settings/secrets/actions) prefixed with `K8S_SECRET_`. the github
deployment action will then ensure they are copied into the runtime environment. in case a secret
needs to be available at build time as well, pass it via
[`secrets`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idsecrets)
in [`./.github/workflows/build-deploy.yaml`](.github/workflows/build-deploy.yaml) and
[mount it as secret in `Dockerfile`](https://docs.docker.com/build/building/secrets/).

## local development

install dependencies:

```bash
pnpm install
```

run a development server on <http://localhost:3000>:

```bash
pnpm run dev
```

> [!TIP]
>
> this template supports developing in containers. when opening the project in your editor, you
> should be prompted to re-open it in a devcontainer.

## e2e tests

generate a production build and run end-to-end tests with:

```bash
pnpm run build
pnpm run test:e2e
```

visual snapshot tests should be run in the template's devcontainer - or a comparable debian bookworm
based linux environment -, and can be updated with:

```bash
pnpm run test:e2e:update-snapshots
```

## deployment

## production deployment checklist
