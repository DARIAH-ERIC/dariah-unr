import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

interface DashboardAdminLayoutProps extends LayoutProps<"/[locale]/dashboard/admin"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminLayoutProps>,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();

	await assertAuthorized({ user, roles: ["admin"] });

	const t = await getTranslations("DashboardAdminLayout");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardAdminLayout(
	props: Readonly<DashboardAdminLayoutProps>,
): Promise<ReactNode> {
	const { children } = props;

	const { user } = await assertAuthenticated();

	await assertAuthorized({ user, roles: ["admin"] });

	// const t = await getTranslations("DashboardAdminLayout");

	return <div>{children}</div>;
}
