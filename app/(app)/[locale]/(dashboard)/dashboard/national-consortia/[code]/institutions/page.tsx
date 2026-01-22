import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getCountryByCode } from "@/lib/queries/countries";
import { getInstitutionsByCountryCode } from "@/lib/queries/institutions";
import { createMetadata } from "@/lib/server/metadata";

const SearchParamsSchema = v.object({
	limit: v.optional(
		v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(1), v.maxValue(100)),
		"10",
	),
	offset: v.optional(
		v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(0)),
		"0",
	),
});

interface DashboardCountryInstitutionsPageProps extends PageProps<"/[locale]/dashboard/national-consortia/[code]/institutions"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryInstitutionsPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryInstitutionsPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardCountryInstitutionsPage(
	props: Readonly<DashboardCountryInstitutionsPageProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryInstitutionsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<CountryInstitutionsTable params={params} searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

interface CountryInstitutionsTableProps extends DashboardCountryInstitutionsPageProps {}

async function CountryInstitutionsTable(
	props: Readonly<CountryInstitutionsTableProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { code } = await params;
	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const institutions = await getInstitutionsByCountryCode({ code, limit, offset });

	return <pre>{JSON.stringify(institutions, null, 2)}</pre>;
}
