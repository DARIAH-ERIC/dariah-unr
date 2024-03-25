import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { Country, Report } from "@prisma/client";
import { useFormatter } from "next-intl";

import { PublicationsFormContent } from "@/components/forms/publications-form-content";
import type { ReportCommentsSchema } from "@/lib/schemas/report";
import { getCollectionItems, getCollectionsByCountryCode } from "@/lib/zotero";

interface PublicationsFormProps {
	comments: ReportCommentsSchema | null;
	countryCode: Country["code"];
	reportId: Report["id"];
	year: number;
}

export async function PublicationsForm(props: PublicationsFormProps) {
	const { comments, countryCode, reportId, year } = props;

	const { list } = useFormatter();

	// FIXME: handle fetch errors
	const collectionsByCountryCode = await getCollectionsByCountryCode();
	const collection = collectionsByCountryCode.get(countryCode);
	const items = collection != null ? await getCollectionItems(collection.key) : [];

	const publications = items
		.filter((item) => {
			/**
			 * Filter publications by publication year client-side, because the zotero api does
			 * not allow that. Not that the `parsedDate` field is just a string field, so parsing
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
				creators: list(
					creators.map((creator) => {
						if (isNonEmptyString(creator.name)) return creator.name;
						return [creator.firstName, creator.lastName].filter(isNonEmptyString).join(" ");
					}),
				),
				citation: item.bib,
			};
		})
		.sort((a, z) => {
			return a.citation.localeCompare(z.citation);
		});

	return (
		<PublicationsFormContent
			comments={comments?.publications}
			publications={publications}
			reportId={reportId}
			year={year}
		/>
	);
}
