import type { Metadata, ResolvingMetadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { AcdhImprint } from "@/app/(app)/[locale]/(default)/imprint/_components/acdh-imprint";
import { createMetadata } from "@/lib/server/metadata";

interface ImprintPageProps extends PageProps<"/[locale]/imprint"> {}

export async function generateMetadata(
	_props: ImprintPageProps,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default function ImprintPage(_props: Readonly<ImprintPageProps>): ReactNode {
	const locale = useLocale();
	const t = useTranslations("ImprintPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<AcdhImprint locale={locale} />
		</Main>
	);
}
