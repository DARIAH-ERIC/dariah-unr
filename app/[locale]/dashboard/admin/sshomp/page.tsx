import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminSshompIngestFormContent } from "@/components/admin/sshomp-ingest-form-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";

interface DashboardAdminSshompIngestPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminSshompIngestPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminSshompIngestPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminSshompIngestPage(
	props: DashboardAdminSshompIngestPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminSshompIngestPage");

	return (
		<MainContent className="container grid content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminSshompIngestContent />
		</MainContent>
	);
}

function DashboardAdminSshompIngestContent() {
	return (
		<section className="grid gap-y-8">
			<AdminSshompIngestFormContent />
		</section>
	);
}
