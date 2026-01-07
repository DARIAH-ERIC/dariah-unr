import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { redirect } from "@/lib/navigation/navigation";
import * as v from "valibot";

const SearchParamsSchema = v.object({
	callbackUrl: v.fallback(v.optional(v.pipe(v.string(), v.nonEmpty())), undefined),
});

interface AuthSignInPageProps extends PageProps<"/[locale]/dashboard/admin"> {}

export async function generateMetadata(_props: Readonly<AuthSignInPageProps>): Promise<Metadata> {
	const { user } = await assertAuthenticated();

	await assertAuthorized({ user, roles: ["admin"] });

	const t = await getTranslations("AuthSignInPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

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
