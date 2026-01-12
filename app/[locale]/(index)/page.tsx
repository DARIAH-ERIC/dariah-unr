import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo";
import { MainContent } from "@/components/main-content";
import { LinkButton } from "@/components/ui/link-button";
import { createHref } from "@/lib/navigation/create-href";
import { redirect } from "@/lib/navigation/navigation";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";

interface IndexPageProps extends PageProps<"/[locale]"> {}

export async function generateMetadata(_props: IndexPageProps): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

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

export default function IndexPage(_props: IndexPageProps): ReactNode {
	return (
		<MainContent className="container py-8">
			<IndexPageHeroSection />
		</MainContent>
	);
}

async function IndexPageHeroSection(): Promise<ReactNode> {
	const { session } = await getCurrentSession();

	const locale = await getLocale();
	const t = await getTranslations("IndexPageHeroSection");

	if (session != null) {
		redirect({ href: "/dashboard", locale });
	}

	return (
		<section className="mx-auto grid w-full max-w-(--breakpoint-lg) content-start justify-items-center gap-y-4 px-4 py-8 text-center md:py-16">
			<div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1 text-sm/tight font-medium dark:bg-neutral-800">
				<Logo className="size-4 shrink-0 text-brand" />
				<span>{t("badge")}</span>
			</div>
			<h1 className="text-3xl font-bold tracking-tighter text-balance text-neutral-950 md:text-5xl lg:text-6xl dark:text-neutral-0">
				{t("title")}
			</h1>
			<div className="w-full px-8 text-md text-pretty text-neutral-700 sm:text-lg dark:text-neutral-300">
				{t("lead-in")}
			</div>
			<div className="my-3 flex items-center gap-x-4">
				<LinkButton className="min-w-44" href={createHref({ pathname: "/auth/sign-in" })}>
					{t("sign-in")}
				</LinkButton>
				<LinkButton
					className="min-w-44"
					href={createHref({ pathname: "/documentation/guidelines" })}
					variant="outline"
				>
					{t("read-documentation")}
				</LinkButton>
			</div>
		</section>
	);
}
