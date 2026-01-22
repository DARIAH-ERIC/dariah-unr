import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getCountryByCode } from "@/lib/queries/countries";
import { getReportByCountryCodeAndYear } from "@/lib/queries/reports";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardCountryReportByYearEditPageProps extends PageProps<"/[locale]/dashboard/national-consortia/[code]/reports/[year]/edit"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryReportByYearEditPageProps>,
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

	const t = await getTranslations("DashboardCountryReportByYearEditPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardCountryReportByYearEditPage(
	props: Readonly<DashboardCountryReportByYearEditPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryReportByYearEditPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<CountryReportByYearEditForm params={params} />
			</Suspense>
		</Main>
	);
}

const ParamsSchema = v.object({
	code: v.pipe(v.string(), v.nonEmpty()),
	year: v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(2000)),
});

interface CountryReportByYearEditFormProps extends Pick<
	DashboardCountryReportByYearEditPageProps,
	"params"
> {}

async function CountryReportByYearEditForm(
	props: Readonly<CountryReportByYearEditFormProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { code, year } = await v.parseAsync(ParamsSchema, await params);

	const report = await getReportByCountryCodeAndYear({ code, year });

	if (report == null) {
		notFound();
	}

	return <pre>{JSON.stringify(report, null, 2)}</pre>;
}
