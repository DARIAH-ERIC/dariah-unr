# dariah unified national reporting

application for key performance indicators.

## how to run

prerequisites:

- [Node.js v20](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

adjust environment variables in `.github/workflows/validate.yml` and
`.github/workflows/build-deploy.yml`.

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

## data model

inspect the data model as [prisma schema](./prisma/schema.prisma) or
[svg diagram](./public/assets/images/content/documentation/data-model/data-model.svg).
