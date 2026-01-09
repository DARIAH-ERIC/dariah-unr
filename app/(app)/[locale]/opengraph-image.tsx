import { notFound } from "next/navigation";
import type { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { MetadataImage } from "@/components/metadata-image";
import { isValidLocale } from "@/lib/i18n/locales";
import { routing } from "@/lib/i18n/routing";

const size = {
	height: 630,
	width: 1200,
};

interface OpenGraphImageProps extends PageProps<"/[locale]"> {}

export function generateStaticParams(): Array<Awaited<OpenGraphImageProps["params"]>> {
	return routing.locales.map((locale) => {
		return { locale };
	});
}

export default async function openGraphImage(
	props: Readonly<OpenGraphImageProps>,
): Promise<ImageResponse> {
	const { params } = props;

	const { locale } = await params;
	// FIXME: Replace with whatever succeeds `dynamicParams = false`.
	if (!isValidLocale(locale)) {
		notFound();
	}

	// FIXME: `next/root-params` does not work in route handlers yet.
	// const locale = await getLocale();
	// const meta = await getMetadata();
	// const title = meta.title;
	const t = await getTranslations({ locale, namespace: "metadata" });
	const title = t("title");

	return MetadataImage({ locale, size, title });
}
