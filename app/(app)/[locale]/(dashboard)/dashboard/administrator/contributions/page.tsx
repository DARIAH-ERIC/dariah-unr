import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getContributions } from "@/lib/queries/contributions";

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

interface DashboardAdminContributionsPageProps extends PageProps<"/[locale]/dashboard/administrator/contributions"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminContributionsPageProps>,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();

	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminContributionsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardAdminContributionsPage(
	props: Readonly<DashboardAdminContributionsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { user } = await assertAuthenticated();

	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminContributionsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminContributionsTable searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

interface AdminContributionsTableProps extends Pick<
	DashboardAdminContributionsPageProps,
	"searchParams"
> {}

async function AdminContributionsTable(
	props: Readonly<AdminContributionsTableProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const contributions = await getContributions({ limit, offset });

	return <pre>{JSON.stringify(contributions, null, 2)}</pre>;
}
