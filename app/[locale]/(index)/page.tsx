import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo";
import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";

interface IndexPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: IndexPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const _t = await getTranslations({ locale, namespace: "IndexPage" });

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default function IndexPage(props: IndexPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("IndexPage");

	return (
		<MainContent className="container py-8">
			<section className="grid max-w-screen-md items-start justify-items-start gap-3 px-4 py-8 md:py-12">
				<div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1 text-sm font-medium leading-tight">
					<Logo className="size-4 shrink-0 text-brand" />
					<span>{t("badge")}</span>
				</div>
				<h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
					{t("title")}
				</h1>
				<p className="text-lg text-on-muted sm:text-xl">{t("lead-in")}</p>
			</section>
		</MainContent>
	);
}
