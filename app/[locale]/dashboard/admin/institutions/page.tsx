import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminInstitutionsTableContent } from "@/components/admin/institutions-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getInstitutions } from "@/lib/data/institution";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminInstitutionsPageProps extends PageProps<"/[locale]/dashboard/admin/institutions"> {}

export async function generateMetadata(
	_props: DashboardAdminInstitutionsPageProps,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminInstitutionsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminInstitutionsPage(
	_props: DashboardAdminInstitutionsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminInstitutionsPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminInstitutionsContent />
		</MainContent>
	);
}

function DashboardAdminInstitutionsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminInstitutionsForm />
			</Suspense>
		</section>
	);
}

async function AdminInstitutionsForm() {
	const [countries, institutions] = await Promise.all([getCountries(), getInstitutions()]);

	return <AdminInstitutionsTableContent countries={countries} institutions={institutions} />;
}
