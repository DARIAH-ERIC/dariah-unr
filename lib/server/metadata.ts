import type { Metadata, ResolvingMetadata } from "next";

import { getMetadata } from "@/lib/i18n/metadata";

interface CreateMetadataParams {
	description?: string;
	title?: string;
}

export async function createMetadata(
	resolvingMetadata: ResolvingMetadata,
	params: CreateMetadataParams,
): Promise<Metadata> {
	const { description, title } = params;

	const _resolvedMetadata = await resolvingMetadata;
	const _meta = await getMetadata();

	const metadata: Metadata = {
		..._resolvedMetadata,
		title: title ?? _resolvedMetadata.title,
		description: description ?? _resolvedMetadata.description,
		openGraph: {
			..._resolvedMetadata.openGraph,
			title: title ?? _resolvedMetadata.openGraph?.title,
			description: description ?? _resolvedMetadata.openGraph?.description,
		},
	} as Metadata;

	return metadata;
}
