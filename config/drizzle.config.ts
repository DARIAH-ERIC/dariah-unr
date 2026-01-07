import { defineConfig } from "drizzle-kit";

import { env } from "@/config/env.config";

const config = defineConfig({
	casing: "snake_case",
	dbCredentials: {
		database: env.DATABASE_NAME,
		host: env.DATABASE_HOST,
		password: env.DATABASE_PASSWORD,
		port: env.DATABASE_PORT,
		ssl: env.DATABASE_SSL_CONNECTION === "enabled",
		user: env.DATABASE_USER,
	},
	dialect: "postgresql",
	out: "./db/migrations/",
	schema: "./db/schema.ts",
	strict: true,
	verbose: true,
});

export default config;
