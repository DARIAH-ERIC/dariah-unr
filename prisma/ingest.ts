import { log } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

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
