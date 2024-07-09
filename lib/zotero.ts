import {
	createUrl,
	createUrlSearchParams,
	isNonEmptyString,
	keyByToMap,
	request,
} from "@acdh-oeaw/lib";

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
		pathname: `/groups/${String(groupId)}/collections`,
	});

	return url;
}

export async function getCollectionsByCountryCode() {
	const url = createUrl({
		baseUrl,
		pathname: `/groups/${String(groupId)}/collections`,
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
		pathname: `/groups/${String(groupId)}/collections/${id}/items`,
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

interface GetPublicationsParams {
	countryCode: string;
	year: number;
}

export async function getPublications(params: GetPublicationsParams) {
	const { countryCode, year } = params;

	const collectionsByCountryCode = await getCollectionsByCountryCode();
	const collection = collectionsByCountryCode.get(countryCode);
	const items = collection != null ? await getCollectionItems(collection.key) : [];

	const publications = items
		.filter((item) => {
			/**
			 * Filter publications by publication year client-side, because the zotero api does
			 * not allow that. Note that the `parsedDate` field is just a string field, so parsing
			 * as a ISO8601 date is not guaranteed to work.
			 */
			try {
				const date = new Date(item.data.date);
				if (date.getUTCFullYear() === year) return true;
				return false;
			} catch {
				return false;
			}
		})
		.map((item) => {
			const { title, itemType, url, creators = [] } = item.data;

			// TODO: pick only relevant fields
			return {
				id: item.key,
				title,
				kind: itemType,
				url,
				creators: creators.map((creator) => {
					if (isNonEmptyString(creator.name)) return creator.name;
					return [creator.firstName, creator.lastName].filter(isNonEmptyString).join(" ");
				}),
				citation: item.bib,
			};
		})
		.sort((a, z) => {
			return a.citation.localeCompare(z.citation);
		});

	return publications;
}
