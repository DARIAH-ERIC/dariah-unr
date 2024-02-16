import { log } from "@acdh-oeaw/lib";

import { db } from "@/lib/db/index";

async function ingest() {
	//
}

ingest()
	.then(() => {
		log.success("Successfully ingested data into database.");
	})
	.catch((error) => {
		log.error("Failed to ingest data into database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});
