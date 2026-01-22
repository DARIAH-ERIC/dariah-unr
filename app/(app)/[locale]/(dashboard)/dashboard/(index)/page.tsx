import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardPageProps extends PageProps<"/[locale]/dashboard"> {}

export async function generateMetadata(
	_props: Readonly<DashboardPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardPage(
	_props: Readonly<DashboardPageProps>,
): Promise<ReactNode> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardPage");

	return (
		<div>
			<h1>{t("title")}</h1>
		</div>
	);
}
