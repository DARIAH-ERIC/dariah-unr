/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { assert, createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function createServicesFromSshomp() {
	const members = getDariahMemberNames();

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

			const member = reviewer.actor.name;
			const countryCode = members.get(member);

			if (countryCode == null) {
				log.warn(`Unknown country ${member}.`);
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

function getDariahMemberNames() {
	const members = new Map([
		["CLARIAH-AT", "at"],
		["CLARIAH-NL", "nl"],
		["CLaDA-BG", "bg"],
		["DARIAH-BE", "be"],
		["DARIAH-CH", "ch"],
		["DARIAH-DE", "de"],
		["DARIAH-DK", "dk"],
		["DARIAH-FR", "fr"],
		["DARIAH-GR / DYAS", "gr"],
		["DARIAH-HR", "hr"],
		["DARIAH-IE", "ie"],
		["DARIAH-IT", "it"],
		["DARIAH-LU", "lu"],
		["DARIAH-PL", "pl"],
		["DARIAH-PT / ROSSIO", "pt"],
		["DARIAH-SI", "si"],
		["LINDAT/CLARIAH-CZ", "cz"],
	]);

	return members;
}
