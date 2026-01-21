import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminUsersTableContent } from "@/components/admin/users-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getPersons } from "@/lib/data/person";
import { getUsers } from "@/lib/data/user";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminUsersPageProps extends PageProps<"/[locale]/dashboard/admin/users"> {}

export async function generateMetadata(_props: DashboardAdminUsersPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminUsersPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminUsersPage(
	_props: DashboardAdminUsersPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminUsersPage");

	return (
		<MainContent className="grid max-w-(--breakpoint-2xl)! content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminUsersContent />
		</MainContent>
	);
}

function DashboardAdminUsersContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminUsersForm />
			</Suspense>
		</section>
	);
}

async function AdminUsersForm() {
	const [countries, persons, users] = await Promise.all([getCountries(), getPersons(), getUsers()]);

	return <AdminUsersTableContent countries={countries} persons={persons} users={users} />;
}
