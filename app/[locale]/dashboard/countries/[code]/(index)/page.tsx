import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryPageProps extends PageProps<"/[locale]/dashboard/countries/[code]"> {}

export async function generateMetadata(props: DashboardCountryPageProps): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id, name } = country;

	await assertPermissions(user, { kind: "country", id, action: "read" });

	const t = await getTranslations("DashboardCountryPage");

	const metadata: Metadata = {
		title: t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryPage(
	props: DashboardCountryPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id } = country;

	await assertPermissions(user, { id, kind: "country", action: "read" });

	const t = await getTranslations("DashboardCountryPage");

	return (
		<section className="max-w-(--breakpoint-lg)">
			<div className="prose">
				<p>{t("lead-in")}</p>
			</div>
		</section>
	);
}
