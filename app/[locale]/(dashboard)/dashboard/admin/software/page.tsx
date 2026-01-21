import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminSoftwareTableContent } from "@/components/admin/software-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getSoftware } from "@/lib/data/software";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminSoftwarePageProps extends PageProps<"/[locale]/dashboard/admin/software"> {}

export async function generateMetadata(_props: DashboardAdminSoftwarePageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminSoftwarePage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminSoftwarePage(
	_props: DashboardAdminSoftwarePageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminSoftwarePage");

	return (
		<MainContent className="grid max-w-(--breakpoint-2xl)! content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminSoftwarePageContent />
		</MainContent>
	);
}

function DashboardAdminSoftwarePageContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminSoftwareTable />
			</Suspense>
		</section>
	);
}

async function AdminSoftwareTable() {
	const [countries, software] = await Promise.all([getCountries(), getSoftware()]);

	return <AdminSoftwareTableContent countries={countries} software={software} />;
}
