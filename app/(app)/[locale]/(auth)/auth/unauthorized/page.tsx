import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { createMetadata } from "@/lib/server/metadata";

interface AuthUnauthorizedPageProps extends PageProps<"/[locale]/auth/unauthorized"> {}

export async function generateMetadata(
	_props: Readonly<AuthUnauthorizedPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("AuthUnauthorizedPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function AuthUnauthorizedPage(
	_props: Readonly<AuthUnauthorizedPageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("AuthUnauthorizedPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<p>{t("message")}</p>
		</Main>
	);
}
