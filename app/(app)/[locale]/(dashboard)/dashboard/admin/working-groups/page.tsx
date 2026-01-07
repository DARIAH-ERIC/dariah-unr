import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";
import { getWorkingGroups } from "@/lib/queries/working-groups";

interface DashboardAdminWorkingGroupsPageProps extends PageProps<"/[locale]/dashboard/admin/working-groups"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminWorkingGroupsPageProps>,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();

	await assertAuthorized({ user, roles: ["admin"] });

	const t = await getTranslations("DashboardAdminWorkingGroupsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardAdminWorkingGroupsPage(
	props: Readonly<DashboardAdminWorkingGroupsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { user } = await assertAuthenticated();

	await assertAuthorized({ user, roles: ["admin"] });

	const t = await getTranslations("DashboardAdminWorkingGroupsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminWorkingGroupsTable searchParams={searchParams} />
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

interface AdminWorkingGroupsTableProps extends Pick<
	DashboardAdminWorkingGroupsPageProps,
	"searchParams"
> {}

async function AdminWorkingGroupsTable(
	props: Readonly<AdminWorkingGroupsTableProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const workingGroups = await getWorkingGroups({ limit, offset });

	return <pre>{JSON.stringify(workingGroups, null, 2)}</pre>;
}
