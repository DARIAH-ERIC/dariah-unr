import { log } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const year = new Date().getUTCFullYear() - 1;

async function createReportYear() {
	const countries = await db.country.findMany();

	for (const country of countries) {
		await db.report.create({
			data: {
				year,
				country: {
					connect: {
						id: country.id,
					},
				},
			},
		});
	}
}

createReportYear()
	.then(() => {
		log.success(`Successfully created reports for ${String(year)} in the database.`);
	})
	.catch((error: unknown) => {
		log.error(`Failed to create reports for ${String(year)} in the database.\n`, error);
		process.exitCode = 1;
	})
	.finally(() => {
		db.$disconnect().catch((error: unknown) => {
			log.error(String(error));
		});
	});
