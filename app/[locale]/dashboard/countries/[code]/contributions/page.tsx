import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ContributionsTableContent } from "@/components/contributions-table-content";
import { assertPermissions } from "@/lib/access-controls";
import { getContributionsByCountry } from "@/lib/data/contributions";
import { getCountryByCode } from "@/lib/data/country";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryContributionsPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/contributions"> {}

export async function generateMetadata(
	props: DashboardCountryContributionsPageProps,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id, name } = country;

	await assertPermissions(user, { kind: "country", id, action: "edit-metadata" });

	const _t = await getTranslations("DashboardCountryContributionsPage");

	const metadata: Metadata = {
		title: _t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryContributionsPage(
	props: DashboardCountryContributionsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id } = country;

	await assertPermissions(user, { kind: "country", id, action: "edit-metadata" });

	const [contributions, persons, workingGroups, roles] = await Promise.all([
		getContributionsByCountry({ countryId: id }),
		getPersons(),
		getWorkingGroups(),
		getRoles(),
	]);

	return (
		<section className="grid w-full gap-4">
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
