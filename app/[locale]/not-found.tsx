import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";

interface NotFoundPageProps {}

export async function generateMetadata(_props: NotFoundPageProps): Promise<Metadata> {
	const t = await getTranslations("NotFoundPage");

	const metadata: Metadata = {
		title: t("meta.title"),
		robots: {
			index: false,
		},
	};

	return metadata;
}

export default function NotFoundPage(_props: NotFoundPageProps): ReactNode {
	const t = useTranslations("NotFoundPage");

	return (
		<MainContent className="container grid place-content-center py-8">
			<PageTitle>{t("title")}</PageTitle>
		</MainContent>
	);
}
