import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminCountryDashboardContent } from "@/components/admin/country-dashboard-content";
import { assertPermissions } from "@/lib/access-controls";
import { getCountries, getCountryAndRelationsByCode } from "@/lib/data/country";
import { getInstitutions } from "@/lib/data/institution";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminPageProps extends PageProps<"/[locale]/dashboard/admin/countries/[code]"> {}

export async function generateMetadata(_props: DashboardAdminPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminCountryPage(
	props: DashboardAdminPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const { code } = await params;

	const [country, countries, institutions, persons, roles, workingGroups] = await Promise.all([
		getCountryAndRelationsByCode({ code: code }),
		getCountries(),
		getInstitutions(),
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
					institutions={institutions}
					persons={persons}
					roles={roles}
					workingGroups={workingGroups}
				/>
			) : null}
		</div>
	);
}
