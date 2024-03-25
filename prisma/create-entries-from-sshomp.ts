/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { assert, createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function createEntriesFromSshomp() {
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
	const entries: Array<any> = [];
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data = (await request(url, { responseType: "json" })) as any;
		log.info(`Processing ${data.count} entries.`);

		entries.push(...data.items);
		page++;
		hasMorePages = page <= data.pages;
	} while (hasMorePages);

	for (const entry of entries) {
		const id = entry.persistentId;

		/** Entries in sshomp can have leading whitespace in label. */
		const name = (entry.label as string).trim();

		const unrEntry = await db.service.findFirst({
			where: {
				marketplaceId: id,
			},
			select: {
				id: true,
			},
		});

		// @ts-expect-error Missing types.
		const reviewer = entry.contributors.find((contributor) => {
			return contributor.role.code === "reviewer";
		});

		if (reviewer == null) {
			log.warn(`No reviewer found for ${name}.`);
			continue;
		}

		const actorId = reviewer.actor.id;
		const country = await db.country.findFirst({
			where: {
				marketplaceId: actorId,
			},
			select: {
				id: true,
			},
		});

		if (country == null) {
			log.warn(`Unknown actor id ${actorId}.`);
			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const resourceType = entry.properties.find((property: any) => {
			return property.type.code === "resource-category";
		})?.concept?.label;

		if (resourceType === "Software") {
			if (unrEntry == null) {
				await db.software.create({
					data: {
						name,
						marketplaceId: id,
						marketplaceStatus: "added_as_item",
						status: "maintained",
						countries: {
							connect: {
								id: country.id,
							},
						},
					},
				});
				log.info(`Created software "${name}".`);
			} else {
				await db.software.update({
					where: {
						id: unrEntry.id,
					},
					data: {
						name,
						marketplaceId: id,
						marketplaceStatus: "added_as_item",
						status: "maintained",
						countries: {
							connect: {
								id: country.id,
							},
						},
					},
				});
				log.info(`Updated software "${name}".`);
			}
		} else {
			if (unrEntry == null) {
				await db.service.create({
					data: {
						name,
						marketplaceId: id,
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
				log.info(`Created service "${name}".`);
			} else {
				await db.service.update({
					where: {
						id: unrEntry.id,
					},
					data: {
						name,
						marketplaceId: id,
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
				log.info(`Updated service "${name}".`);
			}
		}
	}
}

createEntriesFromSshomp()
	.then(() => {
		log.success("Successfully updated ssh open marketplace software and services in the database.");
	})
	.catch((error) => {
		log.error(
			"Failed to update ssh open marketplace software and services in the database.\n",
			error,
		);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});
