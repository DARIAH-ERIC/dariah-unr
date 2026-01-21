import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { WorkingGroupForm } from "@/components/forms/working-group-form";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroupBySlug } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupWorkingGroupPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/working-group"> {}

export async function generateMetadata(
	props: DashboardWorkingGroupWorkingGroupPageProps,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "edit-metadata" });

	const t = await getTranslations("DashboardWorkingGroupWorkingGroupPage");

	const metadata: Metadata = {
		title: t("meta.title", { name: workingGroup.name }),
	};

	return metadata;
}

export default async function DashboardWorkingGroupWorkingGroupPage(
	props: DashboardWorkingGroupWorkingGroupPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });
	if (workingGroup == null) {
		notFound();
	}

	const { id } = workingGroup;

	await assertPermissions(user, { kind: "working-group", id, action: "edit-metadata" });

	const _t = await getTranslations("DashboardWorkingGroupWorkingGroupPage");

	const [persons, roles] = await Promise.all([getPersons(), getRoles()]);

	return (
		<MainContent className="max-w-(--breakpoint-lg) grid content-start gap-8">
			<PageTitle>Working group</PageTitle>
			<WorkingGroupForm persons={persons} roles={roles} workingGroup={workingGroup} />
		</MainContent>
	);
}
