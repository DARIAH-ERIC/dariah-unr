import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getInstitutions } from "@/lib/queries/institutions";
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

interface DashboardAdminInstitutionsPageProps extends PageProps<"/[locale]/dashboard/administrator/institutions"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminInstitutionsPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminInstitutionsPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardAdminInstitutionsPage(
	props: Readonly<DashboardAdminInstitutionsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminInstitutionsPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminInstitutionsTable searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

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
