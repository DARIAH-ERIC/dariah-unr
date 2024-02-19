import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { z } from "zod";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { getReportByCountryCodeAndYear } from "@/lib/data/report";
import { db } from "@/lib/db";

interface DashboardCountryReportPageProps {
	params: {
		code: string;
		locale: Locale;
		year: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(props: {
	params: Pick<DashboardCountryReportPageProps["params"], "locale">;
}): Promise<Array<Pick<DashboardCountryReportPageProps["params"], "code">>> {
	const { params } = props;

	const { locale } = params;
	const countries = await db.country.findMany({
		select: {
			code: true,
		},
	});

	return countries;
}

export async function generateMetadata(
	props: DashboardCountryReportPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { code, locale, year } = params;
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

	const { code, locale, year } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardCountryReportPage");

	// FIXME: move somewhere else
	const result = z.coerce.number().int().positive().safeParse(year);
	if (!result.success) notFound();
	const _year = result.data;

	return (
		<MainContent className="container py-8">
			<h1>{t("title")}</h1>

			<DashboardCountryReportPageContent code={code} year={_year} />
		</MainContent>
	);
}

interface DashboardCountryReportPageContentProps {
	code: string;
	year: number;
}

// @ts-expect-error Upstream type issue.
async function DashboardCountryReportPageContent(
	props: DashboardCountryReportPageContentProps,
): Promise<ReactNode> {
	const { code, year } = props;

	const report = await getReportByCountryCodeAndYear({ code, year });

	if (report == null) notFound();

	return (
		<div>
			<pre>{JSON.stringify(report, null, 2)}</pre>
		</div>
	);
}
