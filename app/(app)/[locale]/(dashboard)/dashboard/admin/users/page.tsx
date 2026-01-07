import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getUsers } from "@/lib/queries/users";

interface DashboardAdminUsersPageProps extends PageProps<"/[locale]/dashboard/admin/users"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardAdminUsersPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardAdminUsersPage(
	props: Readonly<DashboardAdminUsersPageProps>,
): ReactNode {
	const { searchParams } = props;

	const t = useTranslations("DashboardAdminUsersPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminUsersTable searchParams={searchParams} />
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

interface AdminUsersTableProps extends Pick<DashboardAdminUsersPageProps, "searchParams"> {}

async function AdminUsersTable(props: Readonly<AdminUsersTableProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const users = await getUsers({ limit, offset });

	return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
