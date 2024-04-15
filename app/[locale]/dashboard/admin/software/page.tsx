import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminSoftwareTableContent } from "@/components/admin/software-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCountries } from "@/lib/data/country";
import { getSoftware } from "@/lib/data/software";

interface DashboardAdminSoftwarePageProps {
	params: {
		id: string;
		locale: Locale;
	};
}

// export const dynamicParams = false;

export async function generateStaticParams(props: {
	params: Pick<DashboardAdminSoftwarePageProps["params"], "locale">;
}): Promise<Array<Pick<DashboardAdminSoftwarePageProps["params"], "id">>> {
	const { params } = props;

	const { locale } = params;
	const ids = await Promise.resolve([]);

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: DashboardAdminSoftwarePageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id, locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminSoftwarePage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminSoftwarePage(
	props: DashboardAdminSoftwarePageProps,
): ReactNode {
	const { params } = props;

	const { id, locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminSoftwarePage");

	return (
		<MainContent className="container grid !max-w-screen-2xl gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminSoftwarePageContent />
		</MainContent>
	);
}

async function DashboardAdminSoftwarePageContent() {
	const software = await getSoftware();
	const countries = await getCountries();

	return <AdminSoftwareTableContent countries={countries} software={software} />;
}
