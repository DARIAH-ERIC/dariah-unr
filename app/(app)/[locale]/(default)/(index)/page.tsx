import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";

export function generateMetadata(): Metadata {
	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title}
		 */
	};

	return metadata;
}

export default function IndexPage(): ReactNode {
	const t = useTranslations("IndexPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
		</Main>
	);
}
