import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminCountryDashboardContent } from "@/components/admin/country-dashboard-content";
import { getCountries, getCountryAndRelationsByCode } from "@/lib/data/country";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminPageProps {
	params: Promise<{
		locale: IntlLocale;
		code: string;
	}>;
}

export async function generateMetadata(
	props: DashboardAdminPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminCountryPage(
	props: DashboardAdminPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { code, locale } = await params;
	setRequestLocale(locale);

	await assertAuthenticated(["admin"]);

	const [country, countries, persons, roles, workingGroups] = await Promise.all([
		getCountryAndRelationsByCode({ code: code }),
		getCountries(),
		getPersons(),
		getRoles(),
		getWorkingGroups(),
	]);

	return (
		<div>
			{country ? (
				<AdminCountryDashboardContent
					countries={countries}
					country={country}
					persons={persons}
					roles={roles}
					workingGroups={workingGroups}
				/>
			) : null}
		</div>
	);
}
