/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export function uuidv7(name: string) {
	return p.uuid(name).default(sql`UUIDV7()`);
}

export function timestamp(name: string) {
	return p.timestamp(name, {
		mode: "date",
		precision: 3,
		withTimezone: true,
	});
}

export function timestamps() {
	return {
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => {
				return sql`NOW()`;
			}),
	};
}
