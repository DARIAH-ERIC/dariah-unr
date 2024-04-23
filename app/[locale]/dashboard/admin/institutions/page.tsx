import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminInstitutionsTableContent } from "@/components/admin/institutions-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCountries } from "@/lib/data/country";
import { getInstitutions } from "@/lib/data/institution";

interface DashboardAdminInstitutionsPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminInstitutionsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminInstitutionsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminInstitutionsPage(
	props: DashboardAdminInstitutionsPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminInstitutionsPage");

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
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
