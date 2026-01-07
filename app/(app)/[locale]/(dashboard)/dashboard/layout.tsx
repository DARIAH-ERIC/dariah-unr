// import type { Metadata } from "next";
// import { useTranslations } from "next-intl";
// import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

interface DashboardLayoutProps extends LayoutProps<"/[locale]/dashboard"> {}

// export async function generateMetadata(): Promise<Metadata> {
// 	const t = await getTranslations("DashboardLayout");

// 	const title = t("meta.title");

// 	const metadata: Metadata = {
// 		title,
// 		openGraph: {
// 			title,
// 		},
// 	};

// 	return metadata;
// }

export default function DashboardLayout(props: Readonly<DashboardLayoutProps>): ReactNode {
	const { children } = props;

	// const t = useTranslations("DashboardLayout");

	return <div>{children}</div>;
}
