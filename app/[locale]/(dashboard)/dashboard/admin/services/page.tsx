import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminServicesTableContent } from "@/components/admin/services-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getInstitutions } from "@/lib/data/institution";
import { getServices } from "@/lib/data/service";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminServicesPageProps extends PageProps<"/[locale]/dashboard/admin/services"> {}

export async function generateMetadata(_props: DashboardAdminServicesPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminServicesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminServicesPage(
	_props: DashboardAdminServicesPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminServicesPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminServicesPageContent />
		</MainContent>
	);
}

function DashboardAdminServicesPageContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminServicesTable />
			</Suspense>
		</section>
	);
}

async function AdminServicesTable() {
	const [countries, institutions, services] = await Promise.all([
		getCountries(),
		getInstitutions(),
		getServices(),
	]);

	return (
		<AdminServicesTableContent
			countries={countries}
			institutions={institutions}
			services={services}
		/>
	);
}
