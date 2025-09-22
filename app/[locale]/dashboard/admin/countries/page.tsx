import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminCountriesPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
	searchParams: Promise<{
		code: string;
	}>;
}

export async function generateMetadata(
	props: DashboardAdminCountriesPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminCountriesPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminCountriesPage(
	props: DashboardAdminCountriesPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;

	setRequestLocale(locale);

	await assertAuthenticated(["admin"]);

	return null;
}
