import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getContributionsByCountryCode } from "@/lib/queries/contributions";

interface DashboardCountryContributionsPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/contributions"> {}

export async function generateMetadata(): Promise<Metadata> {
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

export default function DashboardCountryContributionsPage(
	props: Readonly<DashboardCountryContributionsPageProps>,
): ReactNode {
	const { params, searchParams } = props;

	const t = useTranslations("DashboardCountryContributionsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<CountryContributionsTable params={params} searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

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
