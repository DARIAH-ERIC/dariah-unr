import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getOutreach } from "@/lib/queries/outreach";
import { createMetadata } from "@/lib/server/metadata";

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

interface DashboardAdminOutreachPageProps extends PageProps<"/[locale]/dashboard/administrator/outreach"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminOutreachPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminOutreachPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardAdminOutreachPage(
	props: Readonly<DashboardAdminOutreachPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminOutreachPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminOutreachTable searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

interface AdminOutreachTableProps extends Pick<DashboardAdminOutreachPageProps, "searchParams"> {}

async function AdminOutreachTable(props: Readonly<AdminOutreachTableProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const outreach = await getOutreach({ limit, offset });

	return <pre>{JSON.stringify(outreach, null, 2)}</pre>;
}
