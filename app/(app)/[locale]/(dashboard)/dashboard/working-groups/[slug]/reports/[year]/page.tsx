import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getWorkingGroupReportByWorkingGroupSlugAndYear } from "@/lib/queries/working-group-reports";
import { notFound } from "next/navigation";

interface DashboardWorkingGroupReportByYearPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/reports/[year]"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardWorkingGroupReportByYearPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardWorkingGroupReportByYearPage(
	props: Readonly<DashboardWorkingGroupReportByYearPageProps>,
): ReactNode {
	const { params } = props;

	const t = useTranslations("DashboardWorkingGroupReportByYearPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<WorkingGroupReportByYearTable params={params} />
			</Suspense>
		</Main>
	);
}

const ParamsSchema = v.object({
	slug: v.pipe(v.string(), v.nonEmpty()),
	year: v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(2000)),
});

interface WorkingGroupReportByYearTableProps extends Pick<
	DashboardWorkingGroupReportByYearPageProps,
	"params"
> {}

async function WorkingGroupReportByYearTable(
	props: Readonly<WorkingGroupReportByYearTableProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { slug, year } = await v.parseAsync(ParamsSchema, await params);

	const report = await getWorkingGroupReportByWorkingGroupSlugAndYear({ slug, year });

	if (report == null) {
		notFound();
	}

	return <pre>{JSON.stringify(report, null, 2)}</pre>;
}
