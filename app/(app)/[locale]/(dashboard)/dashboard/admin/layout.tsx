// import type { Metadata } from "next";
// import { useTranslations } from "next-intl";
// import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

interface DashboardAdminLayoutProps extends LayoutProps<"/[locale]/dashboard/admin"> {}

// export async function generateMetadata(): Promise<Metadata> {
// 	const t = await getTranslations("DashboardAdminLayout");

// 	const title = t("meta.title");

// 	const metadata: Metadata = {
// 		title,
// 		openGraph: {
// 			title,
// 		},
// 	};

// 	return metadata;
// }

export default function DashboardAdminLayout(
	props: Readonly<DashboardAdminLayoutProps>,
): ReactNode {
	const { children } = props;

	// const t = useTranslations("DashboardAdminLayout");

	return <div>{children}</div>;
}
