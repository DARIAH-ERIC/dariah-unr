import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getCountryByCode } from "@/lib/queries/countries";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardCountryLayoutProps extends LayoutProps<"/[locale]/dashboard/countries/[code]"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryLayoutProps>,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryLayout");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardCountryLayout(
	props: Readonly<DashboardCountryLayoutProps>,
): Promise<ReactNode> {
	const { children, params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	// const t = await getTranslations("DashboardCountryLayout");

	return (
		<div>
			<div>{JSON.stringify(country, null, 2)}</div>
			{children}
		</div>
	);
}
