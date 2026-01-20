import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { LinkButton } from "@/components/ui/link-button";
import { assertPermissions } from "@/lib/access-controls";
import { getWorkingGroupBySlug } from "@/lib/data/working-group";
import { getWorkingGroupReportsByWorkingGroupId } from "@/lib/data/working-group-report";
import { createHref } from "@/lib/navigation/create-href";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupReportsPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/reports"> {}

export async function generateMetadata(
	props: DashboardWorkingGroupReportsPageProps,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupReportsPage");

	const metadata: Metadata = {
		title: t("meta.title", { name: workingGroup.name }),
	};

	return metadata;
}

export default async function DashboardWorkingGroupReportsPage(
	props: DashboardWorkingGroupReportsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });

	const reports = await getWorkingGroupReportsByWorkingGroupId({ workingGroupId: workingGroup.id });

	const _t = await getTranslations("DashboardWorkingGroupReportsPage");

	return (
		<MainContent className="grid max-w-(--brakpoint-lg) content-start gap-8">
			<PageTitle>Reports</PageTitle>

			{reports.length > 0 ? (
				<ul className="flex flex-col gap-y-2" role="list">
					{reports.map((report) => {
						return (
							<li key={report.id}>
								<LinkButton
									href={createHref({
										pathname: `/dashboard/working-groups/${slug}/reports/${String(report.reportCampaign.year)}/edit`,
									})}
								>
									Report for {report.reportCampaign.year} (Status: {report.status})
								</LinkButton>
							</li>
						);
					})}
				</ul>
			) : (
				<p>No reports yet.</p>
			)}
		</MainContent>
	);
}
