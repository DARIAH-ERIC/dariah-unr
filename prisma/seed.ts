import { log } from "@acdh-oeaw/lib";

import { db } from "@/lib/db/index";

async function seed() {
	//
}

seed()
	.then(() => {
		log.success("Successfully seeded database.");
	})
	.catch((error) => {
		log.error("Failed to seed database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});
