import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { InstitutionsTableContent } from "@/components/institutions-table-content";
import { getCountryByCode } from "@/lib/data/country";
import { getInstitutionsByCountry } from "@/lib/data/institution";
import type { IntlLocale } from "@/lib/i18n/locales";
import { dashboardCountryPageParams } from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryInstitutionsPageProps {
	params: Promise<{
		code: string;
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardCountryInstitutionsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;

	await assertAuthenticated(["admin", "national_coordinator"]);

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	const { name } = country;

	const _t = await getTranslations({ locale, namespace: "DashboardCountryInstitutionsPage" });

	const metadata: Metadata = {
		title: _t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryInstitutionsPage(
	props: DashboardCountryInstitutionsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	await assertAuthenticated(["admin", "national_coordinator"]);

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	const institutions = await getInstitutionsByCountry({ countryId: country.id });

	return (
		<section className="grid w-full gap-4">
			<InstitutionsTableContent countries={[country]} institutions={institutions} />
		</section>
	);
}
