import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../config/env.config";
import { relations } from "./relations";

type Client = Awaited<ReturnType<typeof createClient>>;

declare global {
	var __db: Client | undefined;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createClient() {
	const db = drizzle({
		casing: "snake_case",
		connection: {
			database: env.DATABASE_NAME,
			host: env.DATABASE_HOST,
			password: env.DATABASE_PASSWORD,
			port: env.DATABASE_PORT,
			ssl: env.DATABASE_SSL_CONNECTION === "enabled",
			user: env.DATABASE_USER,
		},
		logger: env.NODE_ENV === "development",
		relations,
	});

	return db;
}

export const db = globalThis.__db ?? createClient();

/** Avoid re-creating database client on hot-module-reload. */
if (env.NODE_ENV !== "production") {
	globalThis.__db = db;
}
