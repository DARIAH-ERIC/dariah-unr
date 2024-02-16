import "server-only";

import { PrismaClient } from "@prisma/client";

declare global {
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

export const db = globalThis.db ?? new PrismaClient();

/** Avoid re-creating database clients on hot-module-reload. */
if (process.env.NODE_ENV !== "production") {
	globalThis.db = db;
}
