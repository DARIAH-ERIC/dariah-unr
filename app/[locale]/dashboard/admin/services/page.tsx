import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminServicesTableContent } from "@/components/admin/services-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCountries } from "@/lib/data/country";
import { getInstitutions } from "@/lib/data/institution";
import { getServices, getServiceSizes } from "@/lib/data/service";

interface DashboardAdminServicesPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminServicesPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminServicesPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminServicesPage(
	props: DashboardAdminServicesPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminServicesPage");

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
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
	const [countries, institutions, services, serviceSizes] = await Promise.all([
		getCountries(),
		getInstitutions(),
		getServices(),
		getServiceSizes(),
	]);

	return (
		<AdminServicesTableContent
			countries={countries}
			institutions={institutions}
			serviceSizes={serviceSizes}
			services={services}
		/>
	);
}
