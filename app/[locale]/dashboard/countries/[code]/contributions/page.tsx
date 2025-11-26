import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { ContributionsTableContent } from "@/components/contributions-table-content";
import { getContributionsByCountry } from "@/lib/data/contributions";
import { getCountryByCode } from "@/lib/data/country";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import type { IntlLocale } from "@/lib/i18n/locales";
import { dashboardCountryPageParams } from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryContributionsPageProps {
	params: Promise<{
		code: string;
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardCountryContributionsPageProps,
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

	const _t = await getTranslations({ locale, namespace: "DashboardCountryContributionsPage" });

	const metadata: Metadata = {
		title: _t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryContributionsPage(
	props: DashboardCountryContributionsPageProps,
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

	const [contributions, persons, workingGroups, roles] = await Promise.all([
		getContributionsByCountry({ countryId: country.id }),
		getPersons(),
		getWorkingGroups(),
		getRoles(),
	]);

	return (
		<section className="grid gap-4">
			<ContributionsTableContent
				contributions={contributions}
				countries={[country]}
				persons={persons}
				roles={roles}
				workingGroups={workingGroups}
			/>
		</section>
	);
}
