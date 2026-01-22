import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import type * as schema from "@/db/schema";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getCountryByCode } from "@/lib/queries/countries";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardCountryNationalConsortiumPageProps extends PageProps<"/[locale]/dashboard/national-consortia/[code]/national-consortium"> {}

export async function generateMetadata(
	props: Readonly<DashboardCountryNationalConsortiumPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryNationalConsortiumPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardCountryNationalConsortiumPage(
	props: Readonly<DashboardCountryNationalConsortiumPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "country", id: country.id, action: "read" });

	const t = await getTranslations("DashboardCountryNationalConsortiumPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<NationalConsortiumTable country={country} />
			</Suspense>
		</Main>
	);
}

interface NationalConsortiumTableProps {
	country: Pick<
		typeof schema.countries.$inferSelect,
		"id" | "code" | "name" | "consortiumName" | "type" | "logo" | "startDate" | "endDate"
	>;
}

function NationalConsortiumTable(props: Readonly<NationalConsortiumTableProps>): ReactNode {
	const { country } = props;

	return <pre>{JSON.stringify(country, null, 2)}</pre>;
}
