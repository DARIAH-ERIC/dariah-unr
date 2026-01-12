import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminPersonsTableContent } from "@/components/admin/persons-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getInstitutions } from "@/lib/data/institution";
import { getPersons } from "@/lib/data/person";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminPersonsPageProps extends PageProps<"/[locale]/dashboard/admin/persons"> {}

export async function generateMetadata(_props: DashboardAdminPersonsPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminPersonsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminPersonsPage(
	_props: DashboardAdminPersonsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminPersonsPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminPersonsContent />
		</MainContent>
	);
}

function DashboardAdminPersonsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminPersonsForm />
			</Suspense>
		</section>
	);
}

async function AdminPersonsForm() {
	const [institutions, persons] = await Promise.all([getInstitutions(), getPersons()]);

	return <AdminPersonsTableContent institutions={institutions} persons={persons} />;
}
