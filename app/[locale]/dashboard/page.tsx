import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { auth } from "@/lib/auth";

interface DashboardPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardPage(props: DashboardPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardPage");

	return (
		<MainContent className="container py-8">
			<h1>{t("title")}</h1>

			<DashboardPageContent />
		</MainContent>
	);
}

// @ts-expect-error Upstream type issue.
export async function DashboardPageContent(): Promise<ReactNode> {
	const session = await auth();

	return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
