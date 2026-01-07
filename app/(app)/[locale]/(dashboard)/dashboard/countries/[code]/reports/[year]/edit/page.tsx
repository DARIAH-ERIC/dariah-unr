import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getReportByCountryCodeAndYear } from "@/lib/queries/reports";
import { notFound } from "next/navigation";

interface DashboardCountryReportByYearEditPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/reports/[year]/edit"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardCountryReportByYearEditPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardCountryReportByYearEditPage(
	props: Readonly<DashboardCountryReportByYearEditPageProps>,
): ReactNode {
	const { params } = props;

	const t = useTranslations("DashboardCountryReportByYearEditPage");

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
