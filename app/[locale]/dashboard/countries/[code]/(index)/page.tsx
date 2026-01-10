import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryPageProps {
	params: Promise<{
		code: string;
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardCountryPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { code, locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardCountryPage" });

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const metadata: Metadata = {
		title: t("meta.title", { name: country.name }),
	};

	return metadata;
}

export default async function DashboardCountryPage(
	props: DashboardCountryPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { code, locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardCountryPage");

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { id: country.id, kind: "country", action: "read" });

	return (
		<section>
			<div className="prose">
				<p>{t("lead-in")}</p>
			</div>
		</section>
	);
}
