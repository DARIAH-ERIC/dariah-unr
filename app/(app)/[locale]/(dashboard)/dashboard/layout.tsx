import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import type { ReactNode } from "react";
import { redirect } from "@/lib/navigation/navigation";
import { notFound } from "next/navigation";
import { getCountryById } from "@/lib/queries/countries";

interface DashboardLayoutProps extends LayoutProps<"/[locale]/dashboard"> {}

export async function generateMetadata(_props: Readonly<DashboardLayoutProps>): Promise<Metadata> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardLayout");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardLayout(
	_props: Readonly<DashboardLayoutProps>,
): Promise<ReactNode> {
	// const { children } = props;

	const { user } = await assertAuthenticated();

	const locale = await getLocale();

	if (user.role === "admin") {
		redirect({ href: "/dashboard/admin", locale });
	}

	if (user.countryId != null) {
		const country = await getCountryById({ id: user.countryId });

		if (country == null) {
			notFound();
		}

		redirect({ href: `/dashboard/countries/${country.code}`, locale });
	}

	if (user.personId != null) {
		// TODO:
	}

	// const t = await getTranslations("DashboardLayout");

	notFound();
}
