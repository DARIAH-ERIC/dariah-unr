import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { EditCountryWrapper } from "@/components/forms/country-form";
import { getCountryByCode } from "@/lib/data/country";
import type { IntlLocale } from "@/lib/i18n/locales";
import { dashboardCountryPageParams } from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryNCPageProps {
	params: Promise<{
		code: string;
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardCountryNCPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;

	await assertAuthenticated(["admin", "national_coordinator"]);

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	const { name } = country;

	const _t = await getTranslations({ locale, namespace: "DashboardCountryNCPage" });

	const metadata: Metadata = {
		title: _t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryNCPage(
	props: DashboardCountryNCPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	await assertAuthenticated(["admin", "national_coordinator"]);

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	return <EditCountryWrapper country={country} />;
}
