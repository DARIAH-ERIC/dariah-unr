import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { LinkButton } from "@/components/ui/link-button";
import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { getReportYearsByCountryCode } from "@/lib/data/report";
import { createHref } from "@/lib/navigation/create-href";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryReportsPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/reports"> {}

export async function generateMetadata(props: DashboardCountryReportsPageProps): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id, name } = country;

	await assertPermissions(user, { kind: "country", id, action: "read-write" });

	const t = await getTranslations("DashboardCountryReportsPage");

	const metadata: Metadata = {
		title: t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryReportsPage(
	props: DashboardCountryReportsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id } = country;

	await assertPermissions(user, { kind: "country", id, action: "read-write" });

	const reports = await getReportYearsByCountryCode({ countryCode: code });

	const t = await getTranslations("DashboardCountryReportsPage");

	return (
		<section className="grid gap-8 max-w-(--breakpoint-md)">
			<p className="prose prose-sm">{t("lead-in")}</p>
			<div className="flex flex-col gap-y-4 md:w-1/2">
				{reports
					.sort((a, b) => {
						return a.year - b.year;
					})
					.map((report) => {
						const { year } = report;

						return (
							<LinkButton
								key={year}
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
