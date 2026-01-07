import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getCountryByCode } from "@/lib/queries/countries";
import { notFound } from "next/navigation";

interface DashboardCountryNationalConsortiumPageProps extends PageProps<"/[locale]/dashboard/countries/[code]/national-consortium"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardCountryNationalConsortiumPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardCountryNationalConsortiumPage(
	props: Readonly<DashboardCountryNationalConsortiumPageProps>,
): ReactNode {
	const { params } = props;

	const t = useTranslations("DashboardCountryNationalConsortiumPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<NationalConsortiumTable params={params} />
			</Suspense>
		</Main>
	);
}

interface NationalConsortiumTableProps extends Pick<
	DashboardCountryNationalConsortiumPageProps,
	"params"
> {}

async function NationalConsortiumTable(
	props: Readonly<NationalConsortiumTableProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	return <pre>{JSON.stringify(country, null, 2)}</pre>;
}
