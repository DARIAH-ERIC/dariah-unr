import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { EditCountryWrapper } from "@/components/forms/country-form";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryNCPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/national-consortium"> {}

export async function generateMetadata(props: DashboardCountryNCPageProps): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id, name } = country;

	await assertPermissions(user, { kind: "country", id, action: "edit-metadata" });

	const t = await getTranslations("DashboardCountryNCPage");

	const metadata: Metadata = {
		title: t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryNCPage(
	props: DashboardCountryNCPageProps,
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

	return (
		<main className="max-w-(--breakpoint-md!) grid gap-8 content-start">
			<PageTitle>National consortium</PageTitle>
			<EditCountryWrapper country={country} />
		</main>
	);
}
