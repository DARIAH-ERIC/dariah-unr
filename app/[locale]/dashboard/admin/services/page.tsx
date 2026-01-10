import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminServicesTableContent } from "@/components/admin/services-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { getInstitutions } from "@/lib/data/institution";
import { getServices } from "@/lib/data/service";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminServicesPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardAdminServicesPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminServicesPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminServicesPage(
	props: DashboardAdminServicesPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardAdminServicesPage");

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

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
