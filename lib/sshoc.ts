import { createUrl, createUrlSearchParams, isErr, request } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";

interface SshocResponse {
	hits: number;
	count: number;
	page: number;
	perpage: number;
	pages: number;
	order: Array<"label">;
	items: Array<{
		id: number;
		persistentId: string;
		category: "tool-or-service" | "training-material" | "publication" | "dataset" | "workflow";
		label: string;
		lastInfoUpdate: Date;
		description: string;
		contributors: Array<{
			actor: {
				id: number;
				name: string;
				externalIds: Array<unknown>;
				affiliations: Array<unknown>;
				website?: string;
				email?: string;
			};
			role: {
				code: string;
				label: string;
				ord: number;
				urlTemplate?: string;
			};
		}>;
		properties: Array<{
			type: {
				code: string;
				label: string;
				type: "concept" | "string" | "url" | "boolean";
				groupName: string;
				hidden: boolean;
				ord: number;
				allowedVocabularies: Array<unknown>;
			};
			concept?: {
				code: string;
				vocabulary: unknown;
				label: string;
				notation: string;
				uri: string;
				candidate: boolean;
				definition?: string;
			};
			value?: string;
		}>;
		status: "approved";
		owner: string;
		accessibleAt: Array<string>;
		thumbnailId?: string;
	}>;
	categories: {
		"tool-or-service": {
			count: number;
			checked: boolean;
			label: string;
		};
		"training-material": {
			count: number;
			checked: boolean;
			label: string;
		};
		publication: {
			count: number;
			checked: boolean;
			label: string;
		};
		dataset: {
			count: number;
			checked: boolean;
			label: string;
		};
		workflow: {
			count: number;
			checked: boolean;
			label: string;
		};
		step: {
			count: number;
			checked: boolean;
			label: string;
		};
	};
	facets: {
		activity: Record<
			string,
			{
				count: number;
				checked: boolean;
			}
		>;
		source: Record<
			string,
			{
				count: number;
				checked: boolean;
			}
		>;
		keyword: Record<
			string,
			{
				count: number;
				checked: boolean;
			}
		>;
		language: Record<
			string,
			{
				count: number;
				checked: boolean;
			}
		>;
	};
}

export async function getActorResources({
	marketplaceActorId,
}: {
	marketplaceActorId: number | null;
}) {
	if (marketplaceActorId == null) {
		return [];
	}

	const entries = [];
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

		const result = await request<SshocResponse>(url, { responseType: "json" });

		if (isErr(result)) {
			throw result.error;
		}

		const { items, pages } = result.value.data;

		entries.push(...items);

		page++;
		hasMorePages = page <= pages;
	} while (hasMorePages);

	const filtered = entries.filter((entry) => {
		return entry.contributors.some((contributor) => {
			return contributor.actor.id === marketplaceActorId && contributor.role.code === "reviewer";
		});
	});

	return filtered.map((entry) => {
		const resourceTypes = entry.properties
			.filter((property) => {
				return property.type.code === "resource-category";
			})
			.map((property) => {
				return property.concept!.label;
			});

		const isCoreService = entry.properties.some((property) => {
			return property.type.code === "keyword" && property.concept!.label === "DARIAH Core Service";
		});

		const type = isCoreService
			? ("Core service" as const)
			: resourceTypes.includes("Software")
				? ("Software" as const)
				: ("Service" as const);

		return {
			id: entry.persistentId,
			label: entry.label,
			type,
			accessibleAt: entry.accessibleAt,
		};
	});
}
