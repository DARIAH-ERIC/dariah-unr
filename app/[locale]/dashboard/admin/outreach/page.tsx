import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminOutreachTableContent } from "@/components/admin/outreach-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCountries } from "@/lib/data/country";
import { getOutreach } from "@/lib/data/outreach";

interface DashboardAdminOutreachPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminOutreachPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminOutreachPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminOutreachPage(
	props: DashboardAdminOutreachPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminOutreachPage");

	return (
		<MainContent className="container grid !max-w-screen-2xl gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminOutreachPageContent />
		</MainContent>
	);
}

function DashboardAdminOutreachPageContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminOutreachTable />
			</Suspense>
		</section>
	);
}

async function AdminOutreachTable() {
	const [countries, outreach] = await Promise.all([getCountries(), getOutreach()]);

	return <AdminOutreachTableContent countries={countries} outreach={outreach} />;
}
