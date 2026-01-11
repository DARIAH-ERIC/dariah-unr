/* eslint-disable no-restricted-syntax */

import { addTrailingSlash, err, isErr, ok, removeTrailingSlash } from "@acdh-oeaw/lib";
import { createEnv, ValidationError } from "@acdh-oeaw/validate-env/next";
import * as v from "valibot";

const result = createEnv({
	schemas: {
		system(environment) {
			const schema = v.object({
				NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
			});

			const result = v.safeParse(schema, environment);

			if (!result.success) {
				return err(
					new ValidationError(
						`Invalid or missing environment variables.\n${v.summarize(result.issues)}`,
					),
				);
			}

			return ok(result.output);
		},
		private(environment) {
			const schema = v.object({
				BUILD_MODE: v.optional(v.picklist(["export", "standalone"])),
				BUNDLE_ANALYZER: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
				CI: v.optional(v.pipe(v.unknown(), v.toBoolean())),
				DATABASE_DIRECT_URL: v.pipe(v.string(), v.url()),
				DATABASE_URL: v.pipe(v.string(), v.url()),
				EMAIL_ADDRESS: v.pipe(v.string(), v.email()),
				EMAIL_SMTP_PASSWORD: v.optional(v.pipe(v.string(), v.nonEmpty())),
				EMAIL_SMTP_PORT: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
				EMAIL_SMTP_SERVER: v.pipe(v.string(), v.nonEmpty()),
				EMAIL_SMTP_USERNAME: v.optional(v.pipe(v.string(), v.nonEmpty())),
				IMGPROXY_BASE_URL: v.pipe(v.string(), v.url()),
				IMGPROXY_KEY: v.pipe(v.string(), v.nonEmpty()),
				IMGPROXY_SALT: v.pipe(v.string(), v.nonEmpty()),
				KEYSTATIC_GITHUB_CLIENT_ID: v.optional(v.pipe(v.string(), v.nonEmpty())),
				KEYSTATIC_GITHUB_CLIENT_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
				KEYSTATIC_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_RUNTIME: v.optional(v.picklist(["edge", "nodejs"])),
				S3_ACCESS_KEY: v.pipe(v.string(), v.nonEmpty()),
				S3_BUCKET_NAME: v.pipe(v.string(), v.nonEmpty()),
				S3_HOST: v.pipe(v.string(), v.nonEmpty()),
				S3_PORT: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
				S3_PROTOCOL: v.optional(v.picklist(["http", "https"]), "https"),
				S3_SECRET_KEY: v.pipe(v.string(), v.nonEmpty()),
				SENTRY_AUTH_TOKEN: v.optional(v.pipe(v.string(), v.nonEmpty())),
				SSHOC_MARKETPLACE_API_BASE_URL: v.pipe(v.string(), v.url()),
				SSHOC_MARKETPLACE_BASE_URL: v.pipe(v.string(), v.url()),
				SSHOC_MARKETPLACE_PASSWORD: v.pipe(v.string(), v.nonEmpty()),
				SSHOC_MARKETPLACE_USER_NAME: v.pipe(v.string(), v.nonEmpty()),
			});

			const result = v.safeParse(schema, environment);

			if (!result.success) {
				return err(
					new ValidationError(
						`Invalid or missing environment variables.\n${v.summarize(result.issues)}`,
					),
				);
			}

			return ok(result.output);
		},
		public(environment) {
			const schema = v.object({
				NEXT_PUBLIC_APP_BASE_URL: v.pipe(v.string(), v.url(), v.transform(removeTrailingSlash)),
				NEXT_PUBLIC_APP_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
				NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG: v.optional(
					v.picklist(["disabled", "enabled"]),
					"enabled",
				),
				NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL: v.pipe(
					v.string(),
					v.url(),
					v.transform(removeTrailingSlash),
				),
				NEXT_PUBLIC_APP_MATOMO_BASE_URL: v.optional(
					v.pipe(v.string(), v.url(), v.transform(addTrailingSlash)),
				),
				NEXT_PUBLIC_APP_MATOMO_ID: v.optional(
					v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
				),
				NEXT_PUBLIC_APP_SERVICE_ID: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
				NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_PUBLIC_KEYSTATIC_MODE: v.optional(v.picklist(["github", "local"]), "local"),
				NEXT_PUBLIC_SENTRY_DSN: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_PUBLIC_SENTRY_ORG: v.optional(v.pipe(v.string(), v.nonEmpty())),
				NEXT_PUBLIC_SENTRY_PII: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
				NEXT_PUBLIC_SENTRY_PROJECT: v.optional(v.pipe(v.string(), v.nonEmpty())),
			});

			const result = v.safeParse(schema, environment);

			if (!result.success) {
				return err(
					new ValidationError(
						`Invalid or missing environment variables.\n${v.summarize(result.issues)}`,
					),
				);
			}

			return ok(result.output);
		},
	},
	environment: {
		BUILD_MODE: process.env.BUILD_MODE,
		BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
		CI: process.env.CI,
		DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
		EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
		EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT,
		EMAIL_SMTP_SERVER: process.env.EMAIL_SMTP_SERVER,
		EMAIL_SMTP_USERNAME: process.env.EMAIL_SMTP_USERNAME,
		IMGPROXY_BASE_URL: process.env.IMGPROXY_BASE_URL,
		IMGPROXY_KEY: process.env.IMGPROXY_KEY,
		IMGPROXY_SALT: process.env.IMGPROXY_SALT,
		KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
		KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
		KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_APP_BOTS: process.env.NEXT_PUBLIC_APP_BOTS,
		NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG: process.env.NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG,
		NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL: process.env.NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL,
		NEXT_PUBLIC_APP_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_APP_MATOMO_BASE_URL,
		NEXT_PUBLIC_APP_MATOMO_ID: process.env.NEXT_PUBLIC_APP_MATOMO_ID,
		NEXT_PUBLIC_APP_SERVICE_ID: process.env.NEXT_PUBLIC_APP_SERVICE_ID,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
		NEXT_PUBLIC_KEYSTATIC_MODE: process.env.NEXT_PUBLIC_KEYSTATIC_MODE,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_APP_SENTRY_DSN,
		NEXT_PUBLIC_SENTRY_ORG: process.env.NEXT_PUBLIC_APP_SENTRY_ORG,
		NEXT_PUBLIC_SENTRY_PII: process.env.NEXT_PUBLIC_APP_SENTRY_PII,
		NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_APP_SENTRY_PROJECT,
		NEXT_RUNTIME: process.env.NEXT_RUNTIME,
		NODE_ENV: process.env.NODE_ENV,
		S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
		S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
		S3_HOST: process.env.S3_HOST,
		S3_PORT: process.env.S3_PORT,
		S3_PROTOCOL: process.env.S3_PROTOCOL,
		S3_SECRET_KEY: process.env.S3_SECRET_KEY,
		SENTRY_AUTH_TOKEN: process.env.APP_SENTRY_AUTH_TOKEN,
		SSHOC_MARKETPLACE_API_BASE_URL: process.env.SSHOC_MARKETPLACE_API_BASE_URL,
		SSHOC_MARKETPLACE_BASE_URL: process.env.SSHOC_MARKETPLACE_BASE_URL,
		SSHOC_MARKETPLACE_PASSWORD: process.env.SSHOC_MARKETPLACE_PASSWORD,
		SSHOC_MARKETPLACE_USER_NAME: process.env.SSHOC_MARKETPLACE_USER_NAME,
	},
	validation: v.parse(
		v.optional(v.picklist(["disabled", "enabled", "public"]), "enabled"),
		process.env.ENV_VALIDATION,
	),
});

if (isErr(result)) {
	delete result.error.stack;
	throw result.error;
}

export const env = result.value;
