/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { assert, createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function createServicesFromSshomp() {
	const actors = getSshompActors();

	const serviceSizeSmall = await db.serviceSize.findFirst({
		where: {
			type: "small",
		},
		select: {
			id: true,
		},
	});
	assert(serviceSizeSmall);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const services: Array<any> = [];
	let page = 1;
	let hasMorePages = false;

	do {
		const url = createUrl({
			baseUrl: "https://marketplace-api.sshopencloud.eu",
			pathname: "/api/item-search",
			searchParams: createUrlSearchParams({
				categories: "tool-or-service",
				"f.keyword": "DARIAH Resource",
				order: "label",
				page,
				perpage: 50,
			}),
		});

		log.info(`Fetching page ${page}.`);
		const data = await request(url, { responseType: "json" });

		// @ts-expect-error Missing types.
		services.push(...data.items);
		page++;
		// @ts-expect-error Missing types.
		hasMorePages = page <= data.pages;
	} while (hasMorePages);

	for (const service of services) {
		/** Services in sshomp often have leading whitespace in label. */
		const name = (service.label as string).trim();

		const unr = await db.service.findFirst({
			where: {
				name,
			},
		});

		if (unr == null) {
			// @ts-expect-error Missing types.
			const reviewer = service.contributors.find((contributor) => {
				return contributor.role.code === "reviewer";
			});

			if (reviewer == null) {
				log.warn(`No reviewer found for ${name}.`);
				continue;
			}

			const actorId = reviewer.actor.id;
			const countryCode = actors.get(actorId)?.code;

			if (countryCode == null) {
				log.warn(`Unknown actor id ${actorId}.`);
				continue;
			}

			const country = await db.country.findFirst({
				where: {
					code: countryCode,
				},
			});

			if (country == null) {
				log.warn(`Missing country ${countryCode}.`);
				continue;
			}

			await db.service.create({
				data: {
					name,
					marketplaceStatus: "yes",
					status: "live",
					countries: {
						connect: {
							id: country.id,
						},
					},
					size: {
						connect: {
							id: serviceSizeSmall.id,
						},
					},
				},
			});
		}
	}
}

createServicesFromSshomp()
	.then(() => {
		log.success("Successfully updated ssh open marketplace services in the database.");
	})
	.catch((error) => {
		log.error("Failed to update ssh open marketplace services in the database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});

// ------------------------------------------------------------------------------------------------

function getSshompActors() {
	/**
	 * Map ssh open marketplace actor ids to country codes.
	 *
	 * Note: "Bosnia and Herzegovina", "Cyprus", "Malta", "Serbia", and "Spain" are currently not
	 * represented in the ssh open marketplace.
	 */
	const actors = new Map([
		[9403, { code: "at", name: "CLARIAH-AT" }],
		[3235, { code: "be", name: "DARIAH-BE" }],
		[3754, { code: "bg", name: "CLaDA-BG" }],
		[3403, { code: "hr", name: "DARIAH-HR" }],
		[3804, { code: "cz", name: "LINDAT/CLARIAH-CZ" }],
		[9560, { code: "dk", name: "DARIAH-DK" }],
		[10860, { code: "fr", name: "DARIAH-FR" }],
		[2868, { code: "de", name: "DARIAH-DE" }],
		[3502, { code: "gr", name: "DARIAH-GR / DYAS" }],
		[3755, { code: "ie", name: "DARIAH-IE" }],
		[10226, { code: "it", name: "DARIAH-IT" }],
		[9561, { code: "lu", name: "DARIAH-LU" }],
		[9562, { code: "nl", name: "CLARIAH-NL" }],
		[3752, { code: "pl", name: "DARIAH-PL" }],
		[3553, { code: "pt", name: "DARIAH-PT / ROSSIO" }],
		[9133, { code: "si", name: "DARIAH-SI" }],
		[10002, { code: "ch", name: "DARIAH-CH" }],
	]);

	return actors;
}
