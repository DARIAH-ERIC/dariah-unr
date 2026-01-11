import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { assertPermissions } from "@/lib/access-controls";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminCountriesPageProps extends PageProps<"/[locale]/dashboard/admin/countries"> {}

export async function generateMetadata(
	_props: DashboardAdminCountriesPageProps,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminCountriesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminCountriesPage(
	_props: DashboardAdminCountriesPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	return null;
}
