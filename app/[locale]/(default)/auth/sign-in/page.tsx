import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { SignInForm } from "@/components/sign-in-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "@/lib/navigation/navigation";
import { authSignInPageSearchParams } from "@/lib/schemas/auth";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";

interface AuthSignInPageProps extends PageProps<"/[locale]/auth/sign-in"> {}

export async function generateMetadata(props: AuthSignInPageProps): Promise<Metadata> {
	const { searchParams } = props;

	const locale = await getLocale();

	const { callbackUrl } = authSignInPageSearchParams.parse(await searchParams);

	const { session } = await getCurrentSession();

	if (session != null) {
		if (callbackUrl?.startsWith("/dashboard")) {
			redirect({ href: callbackUrl, locale });
		}

		redirect({ href: "/dashboard", locale });
	}

	const t = await getTranslations({ locale, namespace: "AuthSignInPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function AuthSignInPage(props: AuthSignInPageProps): Promise<ReactNode> {
	const { searchParams } = props;

	const locale = await getLocale();

	const { callbackUrl } = authSignInPageSearchParams.parse(await searchParams);

	const { session } = await getCurrentSession();

	if (session != null) {
		if (callbackUrl?.startsWith("/dashboard")) {
			redirect({ href: callbackUrl, locale });
		}

		redirect({ href: "/dashboard", locale });
	}

	const t = await getTranslations("AuthSignInPage");

	return (
		<MainContent className="container grid place-content-center py-8">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				{/* TODO: CardForm, which puts submit button in footer, connected to form via attribute */}
				<SignInForm callbackUrl={callbackUrl} />
			</Card>
		</MainContent>
	);
}
