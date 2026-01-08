import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { getProjects } from "@/lib/queries/projects";
import { assertPermissions } from "@/lib/auth/assert-permissions";

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

interface DashboardAdminProjectsPageProps extends PageProps<"/[locale]/dashboard/admin/projects"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminProjectsPageProps>,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();

	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminProjectsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardAdminProjectsPage(
	props: Readonly<DashboardAdminProjectsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { user } = await assertAuthenticated();

	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminProjectsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminProjectsTable searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

interface AdminProjectsTableProps extends Pick<DashboardAdminProjectsPageProps, "searchParams"> {}

async function AdminProjectsTable(props: Readonly<AdminProjectsTableProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const projects = await getProjects({ limit, offset });

	return <pre>{JSON.stringify(projects, null, 2)}</pre>;
}
