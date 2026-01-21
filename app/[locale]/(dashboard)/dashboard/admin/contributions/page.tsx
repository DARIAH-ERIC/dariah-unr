import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminContributionsTableContent } from "@/components/admin/contributions-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getContributionsWithDetails } from "@/lib/data/contributions";
import { getCountries } from "@/lib/data/country";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminContributionsPageProps extends PageProps<"/[locale]/dashboard/admin/contributions"> {}

export async function generateMetadata(
	_props: DashboardAdminContributionsPageProps,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminContributionsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminContributionsPage(
	_props: DashboardAdminContributionsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminContributionsPage");

	return (
		<MainContent className="grid max-w-(--breakpoint-2xl)! content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminContributionsContent />
		</MainContent>
	);
}

function DashboardAdminContributionsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminContributionsForm />
			</Suspense>
		</section>
	);
}

async function AdminContributionsForm() {
	const [contributions, countries, persons, roles, workingGroups] = await Promise.all([
		getContributionsWithDetails(),
		getCountries(),
		getPersons(),
		getRoles(),
		getWorkingGroups(),
	]);

	return (
		<AdminContributionsTableContent
			contributions={contributions}
			countries={countries}
			persons={persons}
			roles={roles}
			workingGroups={workingGroups}
		/>
	);
}
