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

	const entries = [];
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

		log.info(`Fetching page ${String(page)}.`);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data = (await request(url, { responseType: "json" })) as any;
		log.info(`Processing ${String(data.count)} entries.`);

		entries.push(...data.items);
		page++;
		hasMorePages = page <= data.pages;
	} while (hasMorePages);

	for (const entry of entries) {
		const id = entry.persistentId;

		/** Entries in sshomp can have leading whitespace in label. */
		const name = entry.label.trim();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const reviewers = entry.contributors.filter((contributor: any) => {
			return contributor.role.code === "reviewer";
		});

		if (reviewers == null || reviewers.length === 0) {
			log.warn(`No reviewer found for ${String(name)}.`);
			continue;
		}

		const countries = [];

		for (const reviewer of reviewers) {
			const country = await db.country.findFirst({
				where: {
					marketplaceId: reviewer.actor.id,
				},
				select: {
					id: true,
				},
			});

			if (country != null) {
				countries.push(country);
			}
		}

		if (countries.length === 0) {
			log.warn(`Unknown actor id for ${String(name)}.`);
			continue;
		}

		const resourceTypes = entry.properties
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.filter((property: any) => {
				return property.type.code === "resource-category";
			})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((property: any) => {
				return property.concept.label as string;
			});

		if (resourceTypes.includes("Software")) {
			const software = await db.software.findFirst({
				where: {
					/**
					 * De-deplicate by name, because the initial baserow ingest does not yet have
					 * ssh open marketplace ids.
					 */
					name,
				},
				select: {
					id: true,
				},
			});

			if (software == null) {
				await db.software.create({
					data: {
						name,
						marketplaceId: id,
						marketplaceStatus: "added_as_item",
						status: "maintained",
						countries: {
							connect: countries.map((country) => {
								return { id: country.id };
							}),
						},
					},
				});
				log.info(`Created software "${String(name)}".`);
			} else {
				await db.software.update({
					where: {
						id: software.id,
					},
					data: {
						name,
						marketplaceId: id,
						// marketplaceStatus: "added_as_item",
						// status: "maintained",
						countries: {
							set: countries.map((country) => {
								return { id: country.id };
							}),
						},
					},
				});
				log.info(`Updated software "${String(name)}".`);
			}
		} else {
			const service = await db.service.findFirst({
				where: {
					/**
					 * De-deplicate by name, because the initial baserow ingest does not yet have
					 * ssh open marketplace ids.
					 */
					name,
				},
				select: {
					id: true,
				},
			});

			if (service == null) {
				await db.service.create({
					data: {
						name,
						marketplaceId: id,
						marketplaceStatus: "yes",
						status: "live",
						countries: {
							connect: countries.map((country) => {
								return { id: country.id };
							}),
						},
						size: {
							connect: {
								id: serviceSizeSmall.id,
							},
						},
					},
				});
				log.info(`Created service "${String(name)}".`);
			} else {
				await db.service.update({
					where: {
						id: service.id,
					},
					data: {
						name,
						marketplaceId: id,
						// marketplaceStatus: "yes",
						// status: "live",
						countries: {
							set: countries.map((country) => {
								return { id: country.id };
							}),
						},
						// size: {
						// 	connect: {
						// 		id: serviceSizeSmall.id,
						// 	},
						// },
					},
				});
				log.info(`Updated service "${String(name)}".`);
			}
		}
	}
}

createEntriesFromSshomp()
	.then(() => {
		log.success("Successfully updated ssh open marketplace software and services in the database.");
	})
	.catch((error: unknown) => {
		log.error(
			"Failed to update ssh open marketplace software and services in the database.\n",
			error,
		);
		process.exitCode = 1;
	})
	.finally(() => {
		db.$disconnect().catch((error: unknown) => {
			log.error(String(error));
		});
	});
