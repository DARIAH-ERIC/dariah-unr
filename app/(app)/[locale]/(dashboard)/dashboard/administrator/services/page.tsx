import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getServices } from "@/lib/queries/services";
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

interface DashboardAdminServicesPageProps extends PageProps<"/[locale]/dashboard/administrator/services"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminServicesPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminServicesPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardAdminServicesPage(
	props: Readonly<DashboardAdminServicesPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminServicesPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<AdminServicesTable searchParams={searchParams} />
			</Suspense>
		</Main>
	);
}

interface AdminServicesTableProps extends Pick<DashboardAdminServicesPageProps, "searchParams"> {}

async function AdminServicesTable(props: Readonly<AdminServicesTableProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const { limit, offset } = await v.parseAsync(SearchParamsSchema, await searchParams);

	const services = await getServices({ limit, offset });

	return <pre>{JSON.stringify(services, null, 2)}</pre>;
}
