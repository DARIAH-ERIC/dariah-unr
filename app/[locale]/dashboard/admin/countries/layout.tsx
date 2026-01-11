import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CountryFilter } from "@/components/admin/country-filter";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries } from "@/lib/data/country";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminCountriesLayoutProps extends LayoutProps<"/[locale]/dashboard/admin/countries"> {}

export default async function DashboardAdminCountriesLayout(
	props: DashboardAdminCountriesLayoutProps,
): Promise<ReactNode> {
	const { children } = props;

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const countries = await getCountries();

	const t = await getTranslations("DashboardAdminCountriesPage");

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
