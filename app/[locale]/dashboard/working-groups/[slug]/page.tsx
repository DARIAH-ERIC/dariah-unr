import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getWorkingGroupBySlug } from "@/lib/data/working-group";
import { getWorkingGroupReportsByWorkingGroupId } from "@/lib/data/working-group-report";
import { createHref } from "@/lib/navigation/create-href";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]"> {}

export async function generateMetadata(props: DashboardWorkingGroupPageProps): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupPage");

	const metadata: Metadata = {
		title: t("meta.title", { name: workingGroup.name }),
	};

	return metadata;
}

export default async function DashboardWorkingGroupPage(
	props: DashboardWorkingGroupPageProps,
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

	const t = await getTranslations("DashboardWorkingGroupPage");

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title", { name: workingGroup.name })}</PageTitle>

			<section className="grid gap-y-8">
				<h2>Reports ({reports.length})</h2>

				<ul role="list">
					{reports.map((report) => {
						return (
							<li key={report.id}>
								<Link
									href={createHref({
										pathname: `/dashboard/working-groups/${slug}/reports/${String(report.reportCampaign.year)}`,
									})}
								>
									Report for {report.reportCampaign.year} (Status: {report.status})
								</Link>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
