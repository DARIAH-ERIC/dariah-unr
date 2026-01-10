import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { WorkingGroupReportForm } from "@/components/forms/working-group-report-form";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getReportCampaignByYear } from "@/lib/data/campaign";
import { getWorkingGroupById, getWorkingGroupIdFromSlug } from "@/lib/data/working-group";
import { getWorkingGroupReport } from "@/lib/data/working-group-report";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupReportEditPageProps {
	params: Promise<{
		locale: IntlLocale;
		slug: string;
		year: number;
	}>;
}

export default async function DashboardWorkingGroupReportEditPage(
	props: DashboardWorkingGroupReportEditPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardWorkingGroupReportEditPage");

	const { user } = await assertAuthenticated();

	const { slug, year } = await params;

	const campaign = await getReportCampaignByYear({ year });
	if (campaign == null) notFound();

	const result = await getWorkingGroupIdFromSlug({ slug });
	if (result == null) {
		notFound();
	}
	const { id } = result;

	await assertPermissions(user, { kind: "working-group", id, action: "read-write" });

	const workingGroup = await getWorkingGroupById({ id });
	if (workingGroup == null) {
		notFound();
	}

	const workingGroupReport = await getWorkingGroupReport({
		workingGroupId: workingGroup.id,
		reportCampaignId: campaign.id,
	});

	if (workingGroupReport == null) {
		notFound();
	}

	// const previousCampaign = await getReportCampaignByYear({ year: year - 1 });
	// const previousReport = previousCampaign
	// 	? await getReportByWorkingGroupSlug({ workingGroupSlug: , reportCampaignId: previousCampaign.id })
	// 	: null;

	// const isConfirmationAvailable = hasPermissions()

	// const isReportConfirmed = workingGroupReport.status !== "draft";

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title", { name: workingGroup.name, year })}</PageTitle>

			<section className="grid gap-y-8">
				<WorkingGroupReportForm workingGroupReport={workingGroupReport} />
			</section>
		</MainContent>
	);
}
