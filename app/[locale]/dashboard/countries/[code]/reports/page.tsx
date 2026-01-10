import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { LinkButton } from "@/components/ui/link-button";
import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { getReportYearsByCountryCode } from "@/lib/data/report";
import type { IntlLocale } from "@/lib/i18n/locales";
import { createHref } from "@/lib/navigation/create-href";
import { dashboardCountryPageParams } from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryReportsPageProps {
	params: Promise<{
		code: string;
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardCountryReportsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;

	const { user } = await assertAuthenticated();

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	const { name } = country;

	await assertPermissions(user, { kind: "country", id: country.id, action: "read-write" });

	const _t = await getTranslations({ locale, namespace: "DashboardCountryReportsPage" });

	const metadata: Metadata = {
		title: _t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryReportsPage(
	props: DashboardCountryReportsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "DashboardCountryReportsPage" });

	const { user } = await assertAuthenticated();

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	await assertPermissions(user, { kind: "country", id: country.id, action: "read-write" });

	const reports = await getReportYearsByCountryCode({ countryCode: country.code });

	return (
		<section className="grid gap-8">
			<p className="prose">{t("lead-in")}</p>
			<div className="flex flex-col gap-y-4 md:w-1/2">
				{reports
					.sort((a, b) => {
						return a.year - b.year;
					})
					.map((report) => {
						const { year } = report;
						return (
							<LinkButton
								key={`y_${String(year)}`}
								href={createHref({
									pathname: `/dashboard/countries/${country.code}/reports/${String(year)}/edit/welcome`,
								})}
							>
								{t("go-to-report", { year: String(year) })}
							</LinkButton>
						);
					})}
			</div>
		</section>
	);
}
