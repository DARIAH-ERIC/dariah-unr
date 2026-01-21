import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { InstitutionsTableContent } from "@/components/institutions-table-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { getInstitutionsByCountry } from "@/lib/data/institution";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryInstitutionsPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/institutions"> {}

export async function generateMetadata(
	props: DashboardCountryInstitutionsPageProps,
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

	const t = await getTranslations("DashboardCountryInstitutionsPage");

	const metadata: Metadata = {
		title: t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryInstitutionsPage(
	props: DashboardCountryInstitutionsPageProps,
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

	const institutions = await getInstitutionsByCountry({ countryId: id });

	return (
		<main className="grid gap-8 content-start max-w-(--breakpoint-2xl)!">
			<PageTitle>Institutions</PageTitle>
			<div className="grid w-full gap-4">
				<InstitutionsTableContent countries={[country]} institutions={institutions} />
			</div>
		</main>
	);
}
