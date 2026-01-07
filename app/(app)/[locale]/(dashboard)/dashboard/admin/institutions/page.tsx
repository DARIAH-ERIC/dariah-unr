import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getInstitutions } from "@/lib/queries/institutions";

interface DashboardAdminInstitutionsPageProps extends PageProps<"/[locale]/dashboard/admin/institutions"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardAdminInstitutionsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardAdminInstitutionsPage(
	props: Readonly<DashboardAdminInstitutionsPageProps>,
): ReactNode {
	const { searchParams } = props;

	const t = useTranslations("DashboardAdminInstitutionsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminInstitutionsTable searchParams={searchParams} />
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

interface AdminInstitutionsTableProps extends Pick<
	DashboardAdminInstitutionsPageProps,
	"searchParams"
> {}

async function AdminInstitutionsTable(
	props: Readonly<AdminInstitutionsTableProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const institutions = await getInstitutions({ limit, offset });

	return <pre>{JSON.stringify(institutions, null, 2)}</pre>;
}
