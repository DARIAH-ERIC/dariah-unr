import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { authErrorPageSearchParams } from "@/lib/schemas/auth";

interface AuthErrorPageProps {
	params: {
		locale: Locale;
	};
	searchParams: Record<string, Array<string> | string>;
}

export async function generateMetadata(
	props: AuthErrorPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "AuthErrorPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function AuthErrorPage(props: AuthErrorPageProps): ReactNode {
	const { params, searchParams } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("AuthErrorPage");

	// TODO:
	/** @see https://authjs.dev/guides/basics/pages#error-page */
	const { error } = authErrorPageSearchParams.parse(searchParams);

	return (
		<MainContent className="container py-8">
			<h1>{t("title")}</h1>
			<div>{error}</div>
		</MainContent>
	);
}
