import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminWorkingGroupsTableContent } from "@/components/admin/working-groups-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getContributions } from "@/lib/data/contributions";
import { getPersons } from "@/lib/data/person";
import { getWorkingGroups } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminWorkingGroupsPageProps extends PageProps<"/[locale]/dashboard/admin/working-groups"> {}

export async function generateMetadata(
	_props: DashboardAdminWorkingGroupsPageProps,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminWorkingGroupsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminWorkingGroupsPage(
	_props: DashboardAdminWorkingGroupsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminWorkingGroupsPage");

	return (
		<MainContent className="grid max-w-(--breakpoint-2xl)! content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminWorkingGroupsContent />
		</MainContent>
	);
}

function DashboardAdminWorkingGroupsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminWorkingGroupsForm />
			</Suspense>
		</section>
	);
}

async function AdminWorkingGroupsForm() {
	const [contributions, persons, workingGroups] = await Promise.all([
		getContributions(),
		getPersons(),
		getWorkingGroups(),
	]);

	return (
		<AdminWorkingGroupsTableContent
			chairs={contributions}
			persons={persons}
			workingGroups={workingGroups}
		/>
	);
}
