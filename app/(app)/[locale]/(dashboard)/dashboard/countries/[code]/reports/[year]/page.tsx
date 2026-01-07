import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getReportByCountryCodeAndYear } from "@/lib/queries/reports";
import { notFound } from "next/navigation";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { getCountryByCode } from "@/lib/queries/countries";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface DashboardCountryReportByYearPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/reports/[year]"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryReportByYearPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryReportByYearPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardCountryReportByYearPage(
	props: Readonly<DashboardCountryReportByYearPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryReportByYearPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<CountryReportByYearTable params={params} />
			</Suspense>
		</Main>
	);
}

const ParamsSchema = v.object({
	code: v.pipe(v.string(), v.nonEmpty()),
	year: v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(2000)),
});

interface CountryReportByYearTableProps extends Pick<
	DashboardCountryReportByYearPageProps,
	"params"
> {}

async function CountryReportByYearTable(
	props: Readonly<CountryReportByYearTableProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { code, year } = await v.parseAsync(ParamsSchema, await params);

	const report = await getReportByCountryCodeAndYear({ code, year });

	if (report == null) {
		notFound();
	}

	return <pre>{JSON.stringify(report, null, 2)}</pre>;
}
