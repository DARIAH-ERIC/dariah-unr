import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardAdminLayoutProps extends LayoutProps<"/[locale]/dashboard/administrator"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminLayoutProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminLayout");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardAdminLayout(
	props: Readonly<DashboardAdminLayoutProps>,
): Promise<ReactNode> {
	const { children } = props;

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	// const t = await getTranslations("DashboardAdminLayout");

	return <div>{children}</div>;
}
