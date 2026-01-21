import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { WorkingGroupMembersForm } from "@/components/forms/working-group-members-form";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroupBySlug } from "@/lib/data/working-group";
import { getWorkingGroupMembersByWorkingGroupId } from "@/lib/data/working-group-members";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupMembersPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/working-group"> {}

export async function generateMetadata(
	props: DashboardWorkingGroupMembersPageProps,
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

	const t = await getTranslations("DashboardWorkingGroupMembersPage");

	const metadata: Metadata = {
		title: t("meta.title", { name: workingGroup.name }),
	};

	return metadata;
}

export default async function DashboardWorkingGroupMembersPage(
	props: DashboardWorkingGroupMembersPageProps,
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

	const _t = await getTranslations("DashboardWorkingGroupMembersPage");

	const [contributions, persons, roles] = await Promise.all([
		getWorkingGroupMembersByWorkingGroupId({ id: workingGroup.id }),
		getPersons(),
		getRoles(),
	]);

	return (
		<MainContent className="max-w-(--breakpoint-lg) grid content-start gap-8">
			<PageTitle>Members</PageTitle>
			<WorkingGroupMembersForm
				contributions={contributions}
				persons={persons}
				roles={roles}
				workingGroup={workingGroup}
			/>
		</MainContent>
	);
}
