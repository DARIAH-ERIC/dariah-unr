import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo";
import { MainContent } from "@/components/main-content";
import { LinkButton } from "@/components/ui/link-button";
import type { Locale } from "@/config/i18n.config";
import { createHref } from "@/lib/create-href";

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

	return (
		<MainContent className="container py-8">
			<IndexPageHeroSection />
		</MainContent>
	);
}

function IndexPageHeroSection(): ReactNode {
	const t = useTranslations("IndexPageHeroSection");

	return (
		<section className="mx-auto grid w-full max-w-screen-lg content-start justify-items-center gap-y-4 px-4 py-8 text-center md:py-16">
			<div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1 text-sm font-medium leading-tight dark:bg-neutral-800">
				<Logo className="size-4 shrink-0 text-brand" />
				<span>{t("badge")}</span>
			</div>
			<h1 className="text-balance text-3xl font-bold leading-tight tracking-tighter text-neutral-950 md:text-5xl lg:text-6xl dark:text-neutral-0">
				{t("title")}
			</h1>
			<div className="w-full text-pretty px-8 text-md text-neutral-700 sm:text-lg dark:text-neutral-300">
				{t("lead-in")}
			</div>
			<div className="my-3 flex items-center gap-x-4">
				<LinkButton href={createHref({ pathname: "/dashboard" })}>
					{t("go-to-dashboard")}
				</LinkButton>
				<LinkButton href={createHref({ pathname: "/documentation/guidelines" })} variant="outline">
					{t("read-documentation")}
				</LinkButton>
			</div>
		</section>
	);
}
