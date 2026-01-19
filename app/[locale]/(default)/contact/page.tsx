import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact-form";
import { MainContent } from "@/components/main-content";
import { PageLeadIn } from "@/components/page-lead-in";
import { PageTitle } from "@/components/page-title";
import { contactPageSearchParams } from "@/lib/schemas/email";

interface ContactPageProps extends PageProps<"/[locale]/contact"> {}

export async function generateMetadata(_props: ContactPageProps): Promise<Metadata> {
	const t = await getTranslations("ContactPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ContactPage(props: ContactPageProps): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("ContactPage");

	const contactSearchParams = contactPageSearchParams.parse(await searchParams);

	return (
		<MainContent className="container grid max-w-(--breakpoint-md) content-start gap-8 py-8">
			<PageTitle>{t("title")}</PageTitle>
			<PageLeadIn>{t("lead-in")}</PageLeadIn>

			<ContactForm {...contactSearchParams} />
		</MainContent>
	);
}
