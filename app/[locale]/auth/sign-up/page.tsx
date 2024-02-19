import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { SignUpForm } from "@/components/sign-up-form";
import type { Locale } from "@/config/i18n.config";
import { authSignUpPageSearchParams } from "@/lib/schemas/auth";

interface AuthSignUpPageProps {
	params: {
		locale: Locale;
	};
	searchParams: Record<string, Array<string> | string>;
}

export async function generateMetadata(
	props: AuthSignUpPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "AuthSignUpPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function AuthSignUpPage(props: AuthSignUpPageProps): ReactNode {
	const { params, searchParams } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("AuthSignUpPage");

	const { callbackUrl } = authSignUpPageSearchParams.parse(searchParams);

	return (
		<MainContent className="container grid place-content-center py-8">
			<div className="grid gap-8 rounded-md border bg-surface p-8 text-on-surface shadow-lg">
				<h1>{t("title")}</h1>
				<SignUpForm callbackUrl={callbackUrl} />
			</div>
		</MainContent>
	);
}
