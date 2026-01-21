import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { WorkingGroupOutreachForm } from "@/components/forms/working-group-outreach-form";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getWorkingGroupBySlug } from "@/lib/data/working-group";
import { getWorkingGroupOutreachByWorkingGroupId } from "@/lib/data/working-group-outreach";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupOutreachPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/working-group"> {}

export async function generateMetadata(
	props: DashboardWorkingGroupOutreachPageProps,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "read-write" });

	const t = await getTranslations("DashboardWorkingGroupOutreachPage");

	const metadata: Metadata = {
		title: t("meta.title", { name: workingGroup.name }),
	};

	return metadata;
}

export default async function DashboardWorkingGroupOutreachPage(
	props: DashboardWorkingGroupOutreachPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "read-write" });

	const _t = await getTranslations("DashboardWorkingGroupOutreachPage");

	const outreach = await getWorkingGroupOutreachByWorkingGroupId({ id: workingGroup.id });

	return (
		<MainContent className="max-w-(--breakpoint-lg) grid content-start gap-8">
			<PageTitle>Outreach</PageTitle>
			<WorkingGroupOutreachForm outreach={outreach} workingGroup={workingGroup} />
		</MainContent>
	);
}
