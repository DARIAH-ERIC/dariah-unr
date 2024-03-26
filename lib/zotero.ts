import { createUrl, createUrlSearchParams, keyByToMap, request } from "@acdh-oeaw/lib";

import { groupId } from "@/config/zotero.config";

type UrlString = string;
type HtmlString = string;

export interface ZoteroCollection {
	key: string;
	version: number;
	library: {
		type: string;
		id: number;
		name: string;
	};
	data: {
		key: string;
		version: number;
		name: string;
	};
}

export interface ZoteroItem {
	key: string;
	version: number;
	bib: HtmlString;
	data: {
		key: string;
		itemType: string;
		title: string;
		creators?: Array<{
			creatorType: string;
			firstName?: string;
			lastName?: string;
			name?: string;
		}>;
		url?: UrlString;
		date: string;
		dateAdded: string;
		dateModified: string;
	};
	meta: {
		parsedDate: string;
	};
}

const baseUrl = "https://api.zotero.org";
const headers = { "Zotero-API-Version": "3" };

export function createZoteroCollectionUrl() {
	const url = createUrl({
		baseUrl,
		pathname: `/groups/${groupId}/collections`,
	});

	return url;
}

export async function getCollectionsByCountryCode() {
	const url = createUrl({
		baseUrl,
		pathname: `/groups/${groupId}/collections`,
	});

	const collections = (await request(url, {
		headers,
		responseType: "json",
	})) as Array<ZoteroCollection>;

	const collectionsByCountryCode = keyByToMap(collections, (collection) => {
		return collection.data.name.toLowerCase();
	});

	return collectionsByCountryCode;
}

export async function getCollectionItems(id: string) {
	const url = createUrl({
		baseUrl,
		pathname: `/groups/${groupId}/collections/${id}/items`,
		searchParams: createUrlSearchParams({
			/** Exclude notes. */
			itemType: "-note",
			/** Valid options are: "bib", "citation", "data". */
			include: ["bib", "data"].join(","),
		}),
	});

	const items = (await request(url, {
		headers,
		responseType: "json",
	})) as Array<ZoteroItem>;

	return items;
}
