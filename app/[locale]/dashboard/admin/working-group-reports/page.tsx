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

interface DashboardAdminWorkingGroupReportsPageProps extends PageProps<"/[locale]/dashboard/admin/working-groups"> {}

export async function generateMetadata(
	_props: DashboardAdminWorkingGroupReportsPageProps,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminWorkingGroupReportsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminWorkingGroupReportsPage(
	_props: DashboardAdminWorkingGroupReportsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminWorkingGroupReportsPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminWorkingGroupReportsContent />
		</MainContent>
	);
}

function DashboardAdminWorkingGroupReportsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminWorkingGroupReportsForm />
			</Suspense>
		</section>
	);
}

async function AdminWorkingGroupReportsForm() {
	// const [contributions, persons, workingGroups, workingGroupReports] = await Promise.all([
	// 	getContributions(),
	// 	getPersons(),
	// 	getWorkingGroups(),
	// 	getWorkingGroupReports(),
	// ]);

	// return (
	// 	<AdminWorkingGroupReportsTableContent
	// 		chairs={contributions}
	// 		persons={persons}
	// 		workingGroups={workingGroups}
	// 	/>
	// );

	return null;
}
