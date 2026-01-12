import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminOutreachTableContent } from "@/components/admin/outreach-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getOutreach } from "@/lib/data/outreach";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminOutreachPageProps extends PageProps<"/[locale]/dashboard/admin/outreach"> {}

export async function generateMetadata(_props: DashboardAdminOutreachPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminOutreachPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminOutreachPage(
	_props: DashboardAdminOutreachPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminOutreachPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminOutreachPageContent />
		</MainContent>
	);
}

function DashboardAdminOutreachPageContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminOutreachTable />
			</Suspense>
		</section>
	);
}

async function AdminOutreachTable() {
	const [countries, outreach] = await Promise.all([getCountries(), getOutreach()]);

	return <AdminOutreachTableContent countries={countries} outreach={outreach} />;
}
