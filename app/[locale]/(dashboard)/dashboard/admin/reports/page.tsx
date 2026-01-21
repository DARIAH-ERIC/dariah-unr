import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminReportsTableContent } from "@/components/admin/reports-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getReports } from "@/lib/data/report";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminReportsPageProps extends PageProps<"/[locale]/dashboard/admin/reports"> {}

export async function generateMetadata(_props: DashboardAdminReportsPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminReportsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminReportsPage(
	_props: DashboardAdminReportsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminReportsPage");

	return (
		<MainContent className="grid max-w-(--breakpoint-2xl)! content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminReportsPageContent />
		</MainContent>
	);
}

function DashboardAdminReportsPageContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminReportsTable />
			</Suspense>
		</section>
	);
}

async function AdminReportsTable() {
	const [countries, reports] = await Promise.all([getCountries(), getReports()]);

	return <AdminReportsTableContent countries={countries} reports={reports} />;
}
