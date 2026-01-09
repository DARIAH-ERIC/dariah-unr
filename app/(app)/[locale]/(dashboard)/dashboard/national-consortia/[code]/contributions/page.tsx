import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getContributionsByCountryCode } from "@/lib/queries/contributions";
import { getCountryByCode } from "@/lib/queries/countries";

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

interface DashboardCountryContributionsPageProps extends PageProps<"/[locale]/dashboard/national-consortia/[code]/contributions"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryContributionsPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryContributionsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardCountryContributionsPage(
	props: Readonly<DashboardCountryContributionsPageProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryContributionsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<CountryContributionsTable params={params} searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

interface CountryContributionsTableProps extends DashboardCountryContributionsPageProps {}

async function CountryContributionsTable(
	props: Readonly<CountryContributionsTableProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { code } = await params;
	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const contributions = await getContributionsByCountryCode({ code, limit, offset });

	return <pre>{JSON.stringify(contributions, null, 2)}</pre>;
}
