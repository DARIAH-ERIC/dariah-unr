import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminStatisticsContent } from "@/components/admin/statistics-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getReportCampaignByYear } from "@/lib/data/campaign";
import {
	getContributionsCount,
	getInstitutionsCount,
	getOutreachCount,
	getProjectFundingLeverages,
	getReportsByReportCampaignId,
	getServicesCount,
} from "@/lib/data/stats";
import type { IntlLocale } from "@/lib/i18n/locales";
import { dashboardAdminStatisticsPageParams } from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminStatisticsPageProps {
	params: Promise<{
		locale: IntlLocale;
		year: string;
	}>;
}

export async function generateMetadata(
	props: DashboardAdminStatisticsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminStatisticsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminStatisticsPage(
	props: DashboardAdminStatisticsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardAdminStatisticsPage");

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const result = dashboardAdminStatisticsPageParams.safeParse(await params);
	if (!result.success) notFound();
	const { year } = result.data;

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
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

	const campaign = await getReportCampaignByYear({ year });
	if (campaign == null) notFound();

	const [
		reports,
		outreachCount,
		servicesCount,
		projectFundingLeverages,
		institutionsCount,
		contributionsCount,
	] = await Promise.all([
		getReportsByReportCampaignId({ reportCampaignId: campaign.id }),
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
