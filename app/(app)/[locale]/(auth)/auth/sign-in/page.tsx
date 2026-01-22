import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { SignInForm } from "@/app/(app)/[locale]/(auth)/auth/sign-in/_components/sign-in-form";
import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { redirect } from "@/lib/navigation/navigation";
import { createMetadata } from "@/lib/server/metadata";

const SearchParamsSchema = v.object({
	callbackUrl: v.fallback(v.optional(v.pipe(v.string(), v.nonEmpty())), undefined),
});

interface AuthSignInPageProps extends PageProps<"/[locale]/auth/sign-in"> {}

export async function generateMetadata(
	_props: Readonly<AuthSignInPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("AuthSignInPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function AuthSignInPage(
	props: Readonly<AuthSignInPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const { session } = await getCurrentSession();

	const locale = await getLocale();

	if (session != null) {
		redirect({ href: "/dashboard", locale });
	}

	const t = await getTranslations("AuthSignInPage");

	const { callbackUrl } = await v.parseAsync(SearchParamsSchema, await searchParams);

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<SignInForm callbackUrl={callbackUrl} />
		</Main>
	);
}
