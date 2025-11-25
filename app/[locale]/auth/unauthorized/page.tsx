import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntlLocale } from "@/lib/i18n/locales";

interface AuthUnauthorizedPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: AuthUnauthorizedPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "AuthUnauthorizedPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function AuthUnauthorizedPage(
	props: AuthUnauthorizedPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("AuthUnauthorizedPage");

	return (
		<MainContent className="container grid place-content-center py-8">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<p>{t("message")}</p>
			</Card>
		</MainContent>
	);
}
