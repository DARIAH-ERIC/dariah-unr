import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { EditCountryWrapper } from "@/components/forms/country-form";
import { assertPermissions } from "@/lib/access-controls";
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

	const { user } = await assertAuthenticated();

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	const { name } = country;

	await assertPermissions(user, { kind: "country", id: country.id, action: "edit-metadata" });

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

	const { user } = await assertAuthenticated();

	const result = dashboardCountryPageParams.safeParse(await params);

	if (!result.success) notFound();

	const { code } = result.data;

	const country = await getCountryByCode({ code });

	if (country == null) notFound();

	await assertPermissions(user, { kind: "country", id: country.id, action: "edit-metadata" });

	return <EditCountryWrapper country={country} />;
}
