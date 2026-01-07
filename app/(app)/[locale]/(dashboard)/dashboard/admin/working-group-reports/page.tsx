import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getWorkingGroupReports } from "@/lib/queries/working-group-reports";

interface DashboardAdminWorkingGroupReportsPageProps extends PageProps<"/[locale]/dashboard/admin/working-group-reports"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardAdminWorkingGroupReportsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardAdminWorkingGroupReportsPage(
	props: Readonly<DashboardAdminWorkingGroupReportsPageProps>,
): ReactNode {
	const { searchParams } = props;

	const t = useTranslations("DashboardAdminWorkingGroupReportsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminWorkingGroupReportsTable searchParams={searchParams} />
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

interface AdminWorkingGroupReportsTableProps extends Pick<
	DashboardAdminWorkingGroupReportsPageProps,
	"searchParams"
> {}

async function AdminWorkingGroupReportsTable(
	props: Readonly<AdminWorkingGroupReportsTableProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const reports = await getWorkingGroupReports({ limit, offset });

	return <pre>{JSON.stringify(reports, null, 2)}</pre>;
}
