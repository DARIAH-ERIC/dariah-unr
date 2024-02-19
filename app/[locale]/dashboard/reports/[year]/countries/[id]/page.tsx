import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";

interface DashboardCountryReportPageProps {
	params: {
		id: string;
		locale: Locale;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(props: {
	params: Pick<DashboardCountryReportPageProps["params"], "locale">;
}): Promise<Array<Pick<DashboardCountryReportPageProps["params"], "id">>> {
	const { params } = props;

	const { locale } = params;
	const countries = await db?.country.findMany({
		select: {
			id: true,
		},
	});

	return countries ?? [];
}

export async function generateMetadata(
	props: DashboardCountryReportPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id, locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardCountryReportPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardCountryReportPage(
	props: DashboardCountryReportPageProps,
): ReactNode {
	const { params } = props;

	const { id, locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardCountryReportPage");

	return (
		<MainContent className="container py-8">
			<h1>{t("title")}</h1>
		</MainContent>
	);
}
