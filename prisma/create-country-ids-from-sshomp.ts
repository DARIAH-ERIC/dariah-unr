import { assert, createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function createCountryIdsFromSshomp() {
	const actors = getSshompActors();

	for (const [code, { id }] of actors) {
		const country = await db.country.findFirst({
			where: {
				code,
			},
		});

		assert(country != null, "Missing country.");

		if (country.marketplaceId != null) continue;

		await db.country.update({
			where: {
				id: country.id,
			},
			data: {
				marketplaceId: id,
			},
		});
	}
}

createCountryIdsFromSshomp()
	.then(() => {
		log.success("Successfully updated ssh open marketplace ids for countries in the database.");
	})
	.catch((error: unknown) => {
		log.error("Failed to update ssh open marketplace ids for countries in the database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});

// ------------------------------------------------------------------------------------------------

function getSshompActors() {
	/**
	 * Map country codes to ssh open marketplace actor ids.
	 *
	 * Note: "Bosnia and Herzegovina", "Cyprus", "Malta", and "Serbia" are currently not
	 * represented in the ssh open marketplace.
	 */
	const actors = new Map([
		["at", { id: 9403, name: "CLARIAH-AT" }],
		["be", { id: 3235, name: "DARIAH-BE" }],
		["bg", { id: 3754, name: "CLaDA-BG" }],
		["ch", { id: 10002, name: "DARIAH-CH" }],
		["cz", { id: 3804, name: "LINDAT/CLARIAH-CZ" }],
		["de", { id: 2868, name: "DARIAH-DE" }],
		["dk", { id: 9560, name: "DARIAH-DK" }],
		["es", { id: 11803, name: "CLARIAH-ES" }],
		["fr", { id: 10860, name: "DARIAH-FR" }],
		["gr", { id: 3502, name: "DARIAH-GR / DYAS" }],
		["hr", { id: 3403, name: "DARIAH-HR" }],
		["ie", { id: 3755, name: "DARIAH-IE" }],
		["it", { id: 10226, name: "DARIAH-IT" }],
		["lu", { id: 9561, name: "DARIAH-LU" }],
		["nl", { id: 9562, name: "CLARIAH-NL" }],
		["pl", { id: 3752, name: "DARIAH-PL" }],
		["pt", { id: 3553, name: "DARIAH-PT / ROSSIO" }],
		["si", { id: 9133, name: "DARIAH-SI" }],
	]);

	return actors;
}
