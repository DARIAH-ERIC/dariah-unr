import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface AuthLayoutProps extends LayoutProps<"/[locale]"> {}

export async function generateMetadata(_props: Readonly<AuthLayoutProps>): Promise<Metadata> {
	const t = await getTranslations("AuthLayout");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function AuthLayout(props: Readonly<AuthLayoutProps>): ReactNode {
	const { children } = props;

	// const t = useTranslations("AuthLayout");

	return <div>{children}</div>;
}
