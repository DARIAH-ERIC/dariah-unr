import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getWorkingGroupReportsByWorkingGroupSlug } from "@/lib/queries/working-group-reports";

interface DashboardWorkingGroupReportsPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/reports"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardWorkingGroupReportsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardWorkingGroupReportsPage(
	props: Readonly<DashboardWorkingGroupReportsPageProps>,
): ReactNode {
	const { params, searchParams } = props;

	const t = useTranslations("DashboardWorkingGroupReportsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<WorkingGroupReportsTable params={params} searchParams={searchParams} />
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

interface WorkingGroupReportsTableProps extends DashboardWorkingGroupReportsPageProps {}

async function WorkingGroupReportsTable(
	props: Readonly<WorkingGroupReportsTableProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { slug } = await params;
	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const reports = await getWorkingGroupReportsByWorkingGroupSlug({ slug, limit, offset });

	return <pre>{JSON.stringify(reports, null, 2)}</pre>;
}
