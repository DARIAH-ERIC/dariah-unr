import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense, useMemo } from "react";

import { AdminStatisticsContent } from "@/components/admin/statistics-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import {
	getContributionsCount,
	getInstitutionsCount,
	getOutreachCount,
	getProjectFundingLeverages,
	getReportsByYear,
	getServicesCount,
} from "@/lib/data/stats";
import { getReportYears } from "@/lib/get-report-years";
import { dashboardAdminStatisticsPageParams } from "@/lib/schemas/dashboard";
import { getCollectionItems, getCollectionsByCountryCode } from "@/lib/zotero";

interface DashboardAdminStatisticsPageProps {
	params: {
		locale: Locale;
		year: string;
	};
}

// export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: Pick<DashboardAdminStatisticsPageProps["params"], "locale">;
}): Promise<Array<Pick<DashboardAdminStatisticsPageProps["params"], "year">>> {
	const years = await Promise.resolve(getReportYears());

	const params = years.map((year) => {
		return { year };
	});

	return params;
}

export async function generateMetadata(
	props: DashboardAdminStatisticsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminStatisticsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminStatisticsPage(
	props: DashboardAdminStatisticsPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminStatisticsPage");

	const result = dashboardAdminStatisticsPageParams.safeParse(params);
	if (!result.success) notFound();
	const { year } = result.data;

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminStatisticsPageContent year={year} />
		</MainContent>
	);
}

interface DashboardAdminStatisticsPageContentProps {
	year: number;
}

function DashboardAdminStatisticsPageContent(props: DashboardAdminStatisticsPageContentProps) {
	const { year } = props;

	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminStatistics year={year} />
			</Suspense>
		</section>
	);
}

interface AdminStatisticsProps {
	year: number;
}

async function AdminStatistics(props: AdminStatisticsProps) {
	const { year } = props;

	const [
		reports,
		outreachCount,
		servicesCount,
		projectFundingLeverages,
		institutionsCount,
		contributionsCount,
	] = await Promise.all([
		getReportsByYear({ year }),
		getOutreachCount({ year }),
		getServicesCount({ year }),
		getProjectFundingLeverages({ year }),
		getInstitutionsCount({ year }),
		getContributionsCount({ year }),
	]);

	const events = {
		small: 0,
		medium: 0,
		large: 0,
	};

	const services = {
		kpis: new Map<string, number>(),
	};

	const outreach = {
		kpis: new Map<string, number>(),
	};

	let totalContributions = 0;

	reports.forEach((report) => {
		events.small += report.eventReport?.smallMeetings ?? 0;
		events.medium += report.eventReport?.mediumMeetings ?? 0;
		events.large += report.eventReport?.largeMeetings ?? 0;

		totalContributions += report.contributionsCount ?? 0;

		report.serviceReports.forEach((serviceReport) => {
			serviceReport.kpis.forEach((kpi) => {
				const current = services.kpis.get(kpi.unit) ?? 0;
				services.kpis.set(kpi.unit, current + kpi.value);
			});
		});

		report.outreachReports.forEach((outreachReport) => {
			outreachReport.kpis.forEach((kpi) => {
				const current = outreach.kpis.get(kpi.unit) ?? 0;
				outreach.kpis.set(kpi.unit, current + kpi.value);
			});
		});
	});

	let publicationsCount = 0;

	const collectionsByCountryCode = await getCollectionsByCountryCode();
	for (const collection of collectionsByCountryCode.values()) {
		const items = await getCollectionItems(collection.key);
		const publications = items.filter((item) => {
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
		});

		publicationsCount += publications.length;
	}

	return (
		<AdminStatisticsContent
			contributionsCount={{ count: totalContributions, byRole: contributionsCount }}
			events={events}
			institutionsCount={institutionsCount}
			outreach={{
				count: Object.fromEntries(
					outreachCount.map(({ _count, type }) => {
						return [type, _count];
					}),
				),
				kpis: Object.fromEntries(outreach.kpis.entries()),
			}}
			projectFundingLeverages={projectFundingLeverages}
			publicationsCount={publicationsCount}
			services={{
				count: Object.fromEntries(
					servicesCount.map(({ _count, status }) => {
						return [String(status), _count];
					}),
				),
				kpis: Object.fromEntries(services.kpis.entries()),
			}}
			year={year}
		/>
	);
}
