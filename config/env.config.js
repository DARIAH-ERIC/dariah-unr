import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	shared: {
		NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
	},
	server: {
		AUTH_GITHUB_ID: z.string().min(1),
		AUTH_GITHUB_SECRET: z.string().min(1),
		AUTH_SECRET: z.string().min(32),
		AUTH_URL: z.string().url().optional(),
		BASEROW_API_BASE_URL: z.string().url().optional(),
		BASEROW_DATABASE_ID: z.string().min(1).optional(),
		BASEROW_EMAIL: z.string().email().optional(),
		BASEROW_PASSWORD: z.string().min(1).optional(),
		BUILD_MODE: z.enum(["export", "standalone"]).optional(),
		BUNDLE_ANALYZER: z.enum(["disabled", "enabled"]).optional(),
		DATABASE_URL: z.string().url(),
		DATABASE_DIRECT_URL: z.string().url(),
		ENV_VALIDATION: z.enum(["disabled", "enabled"]).optional(),
		KEYSTATIC_GITHUB_CLIENT_ID: z.string().min(1).optional(),
		KEYSTATIC_GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
		KEYSTATIC_SECRET: z.string().min(1).optional(),
	},
	client: {
		NEXT_PUBLIC_APP_BASE_URL: z.string().url(),
		NEXT_PUBLIC_BOTS: z.enum(["disabled", "enabled"]).optional(),
		NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: z.string().min(1).optional(),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: z.string().min(1).optional(),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: z.string().min(1).optional(),
		NEXT_PUBLIC_KEYSTATIC_MODE: z.enum(["github", "local"]).default("local"),
		NEXT_PUBLIC_MATOMO_BASE_URL: z.string().url().optional(),
		NEXT_PUBLIC_MATOMO_ID: z.coerce.number().int().positive().optional(),
		NEXT_PUBLIC_REDMINE_ID: z.coerce.number().int().positive(),
	},
	runtimeEnv: {
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_URL: process.env.AUTH_URL,
		BASEROW_API_BASE_URL: process.env.BASEROW_API_BASE_URL,
		BASEROW_DATABASE_ID: process.env.BASEROW_DATABASE_ID,
		BASEROW_EMAIL: process.env.BASEROW_EMAIL,
		BASEROW_PASSWORD: process.env.BASEROW_PASSWORD,
		BUILD_MODE: process.env.BUILD_MODE,
		BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,
		ENV_VALIDATION: process.env.ENV_VALIDATION,
		KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
		KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
		KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_BOTS: process.env.NEXT_PUBLIC_BOTS,
		NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
		NEXT_PUBLIC_KEYSTATIC_MODE: process.env.NEXT_PUBLIC_KEYSTATIC_MODE,
		NEXT_PUBLIC_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_MATOMO_BASE_URL,
		NEXT_PUBLIC_MATOMO_ID: process.env.NEXT_PUBLIC_MATOMO_ID,
		NEXT_PUBLIC_REDMINE_ID: process.env.NEXT_PUBLIC_REDMINE_ID,
	},
	skipValidation: process.env.ENV_VALIDATION === "disabled",
	onValidationError(validationError) {
		const message = "Invalid environment variables";
		log.error(`${message}:`, validationError.flatten().fieldErrors);
		const error = new Error(message);
		delete error.stack;
		throw error;
	},
});
