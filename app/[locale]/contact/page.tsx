import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact-form";
import { MainContent } from "@/components/main-content";
import { PageLeadIn } from "@/components/page-lead-in";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";

interface ContactPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: ContactPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "ContactPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function ContactPage(props: ContactPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("ContactPage");

	return (
		<MainContent className="container grid content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>
			<PageLeadIn>{t("lead-in")}</PageLeadIn>

			<ContactForm />
		</MainContent>
	);
}
