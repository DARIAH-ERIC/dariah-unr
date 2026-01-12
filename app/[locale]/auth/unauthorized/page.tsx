import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthUnauthorizedPageProps extends PageProps<"/[locale]/auth/unauthorized"> {}

export async function generateMetadata(_props: AuthUnauthorizedPageProps): Promise<Metadata> {
	const locale = await getLocale();

	const t = await getTranslations({ locale, namespace: "AuthUnauthorizedPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function AuthUnauthorizedPage(
	_props: AuthUnauthorizedPageProps,
): Promise<ReactNode> {
	const t = await getTranslations("AuthUnauthorizedPage");

	return (
		<MainContent className="container grid place-content-center py-8">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<CardDescription>
					<p>{t("message")}</p>
				</CardDescription>
			</Card>
		</MainContent>
	);
}
