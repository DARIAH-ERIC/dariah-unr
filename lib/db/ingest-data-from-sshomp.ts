/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { createUrl, createUrlSearchParams, isErr, log, request } from "@acdh-oeaw/lib";
import { ServiceType } from "@prisma/client";

import { env } from "@/config/env.config";
import { db } from "@/lib/db";

export async function ingestDataFromSshomp() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const entries: Array<any> = [];
	let page = 1;
	let hasMorePages = false;

	do {
		const url = createUrl({
			baseUrl: env.SSHOC_MARKETPLACE_API_BASE_URL,
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

		const result = await request(url, { responseType: "json" });

		if (isErr(result)) {
			throw result.error
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data = result.value.data as any

		log.info(`Processing ${String(data.count)} entries.`);

		entries.push(...data.items);
		page++;
		hasMorePages = page <= data.pages;
	} while (hasMorePages);

	const stats = {
		software: { created: 0, updated: 0 },
		services: { created: 0, updated: 0 },
	};

	for (const entry of entries) {
		const id = entry.persistentId;

		/** Entries in sshomp can have leading whitespace in label. */
		const name = (entry.label as string).trim();

		const url = entry.accessibleAt;

		// @ts-expect-error Missing types.
		const reviewers = entry.contributors.filter((contributor) => {
			return contributor.role.code === "reviewer";
		});

		if (reviewers == null || reviewers.length === 0) {
			log.warn(`No reviewer found for ${name}.`);
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
			log.warn(`Unknown actor id for ${name}.`);
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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const isCoreService = entry.properties.some((property: any) => {
			return property.type.code === "keyword" && property.concept.label === "DARIAH Core Service";
		});

		if (resourceTypes.includes("Software")) {
			/**
			 * Because of a bug in the initial script, which did not correctly handle multiple
			 * resource categories on a sshomp item, some software items ended up in the service table.
			 * Log these out here to aid manual cleanup.
			 */
			const service = await db.service.findFirst({
				where: {
					marketplaceId: id,
				},
				select: {
					id: true,
				},
			});
			if (service != null) {
				log.error(`Software "${name}" also exists in the service table with id "${service.id}".`);
			}

			const software = await db.software.findFirst({
				where: {
					marketplaceId: id,
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
						url,
						countries: {
							connect: countries.map((country) => {
								return { id: country.id };
							}),
						},
					},
				});

				log.info(`Created software "${name}".`);
				stats.software.created++;
			} else {
				await db.software.update({
					where: {
						id: software.id,
					},
					data: {
						name,
						marketplaceId: id,
						url,
						// marketplaceStatus: "added_as_item",
						// status: "maintained",
						countries: {
							set: countries.map((country) => {
								return { id: country.id };
							}),
						},
					},
				});

				log.info(`Updated software "${name}".`);
				stats.software.updated++;
			}
		} else {
			const service = await db.service.findFirst({
				where: {
					marketplaceId: id,
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
						url,
						countries: {
							connect: countries.map((country) => {
								return { id: country.id };
							}),
						},
						/**
						 * Core services have the "DARIAH Core Service" keyword in the marketplace.
						 * All other services have type "community", because "internal" services are
						 * not sourced from marketplace but exist only in the database.
						 */
						type: isCoreService ? ServiceType.core : ServiceType.community,
					},
				});

				log.info(`Created service "${name}".`);
				stats.services.created++;
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
						url,
						countries: {
							set: countries.map((country) => {
								return { id: country.id };
							}),
						},
						/**
						 * Core services have the "DARIAH Core Service" keyword in the marketplace.
						 * All other services have type "community", because "internal" services are
						 * not sourced from marketplace but exist only in the database.
						 */
						type: isCoreService ? ServiceType.core : ServiceType.community,
					},
				});

				log.info(`Updated service "${name}".`);
				stats.services.updated++;
			}
		}
	}

	return stats;
}
