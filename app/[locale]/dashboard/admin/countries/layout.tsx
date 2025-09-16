import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CountryFilter } from "@/components/admin/country-filter";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { getCountries } from "@/lib/data/country";
import type { IntlLocale } from "@/lib/i18n/locales";

interface CountriesLayoutProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
	children: ReactNode;
}

export default async function CountriesLayout(props: CountriesLayoutProps): Promise<ReactNode> {
	const { children, params } = props;
	const { locale } = await params;

	const countries = await getCountries();

	const t = await getTranslations({ locale, namespace: "DashboardAdminCountriesPage" });
	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>
			<div className="flex justify-start">
				<CountryFilter countries={countries} />
			</div>
			{children}
		</MainContent>
	);
}
