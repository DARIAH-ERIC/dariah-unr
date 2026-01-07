import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getReportsByCountryCode } from "@/lib/queries/reports";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { getCountryByCode } from "@/lib/queries/countries";
import { notFound } from "next/navigation";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface DashboardCountryReportsPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/reports"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryReportsPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryReportsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardCountryReportsPage(
	props: Readonly<DashboardCountryReportsPageProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryReportsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<CountryReportsTable params={params} searchParams={searchParams} />
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

interface CountryReportsTableProps extends DashboardCountryReportsPageProps {}

async function CountryReportsTable(props: Readonly<CountryReportsTableProps>): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { code } = await params;
	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const reports = await getReportsByCountryCode({ code, limit, offset });

	return <pre>{JSON.stringify(reports, null, 2)}</pre>;
}
