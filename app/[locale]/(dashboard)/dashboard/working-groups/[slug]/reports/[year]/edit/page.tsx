import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { WorkingGroupReportForm } from "@/components/forms/working-group-report-form";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions, hasPermissions } from "@/lib/access-controls";
import { getReportCampaignByYear } from "@/lib/data/campaign";
import { getWorkingGroupBySlug } from "@/lib/data/working-group";
import { getWorkingGroupReport } from "@/lib/data/working-group-report";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupReportEditPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/reports/[year]/edit"> {}

const ParamsSchema = v.object({
	slug: v.pipe(v.string(), v.nonEmpty()),
	year: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
});

export default async function DashboardWorkingGroupReportEditPage(
	props: DashboardWorkingGroupReportEditPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const result = v.safeParse(ParamsSchema, await params);
	if (!result.success) {
		notFound();
	}

	const { slug, year } = result.output;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "read-write" });

	const campaign = await getReportCampaignByYear({ year });
	if (campaign == null) {
		notFound();
	}

	const workingGroupReport = await getWorkingGroupReport({
		workingGroupId: id,
		reportCampaignId: campaign.id,
	});

	if (workingGroupReport == null) {
		notFound();
	}

	const previousCampaign = await getReportCampaignByYear({ year: year - 1 });
	const previousWorkingGroupReport = previousCampaign
		? await getWorkingGroupReport({
				workingGroupId: id,
				reportCampaignId: previousCampaign.id,
			})
		: null;

	const isConfirmationAvailable = await hasPermissions(user, {
		kind: "working-group",
		id,
		action: "confirm",
	});

	const _t = await getTranslations("DashboardWorkingGroupReportEditPage");

	return (
		<MainContent className="max-w-(--brakpoint-lg) grid content-start gap-8">
			<PageTitle>Report {year}</PageTitle>

			<section className="grid gap-y-8">
				<WorkingGroupReportForm
					isConfirmationAvailable={isConfirmationAvailable}
					previousWorkingGroupReport={previousWorkingGroupReport}
					workingGroup={workingGroup}
					workingGroupReport={workingGroupReport}
				/>
			</section>
		</MainContent>
	);
}
