import { createUrl, createUrlSearchParams, HttpError, isErr, request } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { env } from "@/config/env.config";
import type { IntlLocale } from "@/lib/i18n/locales";

interface ImprintPageProps extends PageProps<"/[locale]/imprint"> {}

export async function generateMetadata(_props: ImprintPageProps): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(_props: ImprintPageProps): Promise<ReactNode> {
	const locale = await getLocale();

	const t = await getTranslations("ImprintPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-md) content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<ImprintPageContent locale={locale} />
		</MainContent>
	);
}

interface ImprintPageContentProps {
	locale: IntlLocale;
}

async function ImprintPageContent(props: ImprintPageContentProps) {
	const { locale } = props;

	const html = await getImprintHtml(locale);

	// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
	return <div dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm" />;
}

async function getImprintHtml(locale: IntlLocale): Promise<string> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL,
		pathname: `/${String(env.NEXT_PUBLIC_APP_SERVICE_ID)}`,
		searchParams: createUrlSearchParams({
			locale,
			redmine: env.NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG,
		}),
	});

	const result = await request(url, { responseType: "text" });

	if (isErr(result)) {
		const error = result.error;

		if (HttpError.is(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}

	return result.value.data;
}
