import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { InstitutionsFormContent } from "@/components/admin/institutions-form-content";
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
		<MainContent className="container grid content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminInstitutionsContent />
		</MainContent>
	);
}

async function DashboardAdminInstitutionsContent() {
	const institutions = await getInstitutions();
	const countries = await getCountries();

	return (
		<section>
			<InstitutionsFormContent countries={countries} institutions={institutions} />
		</section>
	);
}
