import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getReportCampaignByYear } from "@/lib/data/campaign";
import { getWorkingGroupById, getWorkingGroupIdFromSlug } from "@/lib/data/working-group";
import { getWorkingGroupReport } from "@/lib/data/working-group-report";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupReportPageProps {
	params: Promise<{
		locale: IntlLocale;
		slug: string;
		year: number;
	}>;
}

export default async function DashboardWorkingGroupReportPage(
	props: DashboardWorkingGroupReportPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardWorkingGroupReportPage");

	const { user } = await assertAuthenticated();

	const { slug, year } = await params;

	const result = await getWorkingGroupIdFromSlug({ slug });
	if (result == null) {
		notFound();
	}
	const { id } = result;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });

	const workingGroup = await getWorkingGroupById({ id });
	if (workingGroup == null) {
		notFound();
	}

	const campaign = await getReportCampaignByYear({ year });
	if (campaign == null) notFound();

	const workingGroupReport = await getWorkingGroupReport({
		workingGroupId: workingGroup.id,
		reportCampaignId: campaign.id,
	});

	if (workingGroupReport == null) {
		notFound();
	}

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title", { name: workingGroup.name, year })}</PageTitle>

			<section className="grid gap-y-8">
				<pre>{JSON.stringify({ workingGroupReport }, null, 2)}</pre>
			</section>
		</MainContent>
	);
}
