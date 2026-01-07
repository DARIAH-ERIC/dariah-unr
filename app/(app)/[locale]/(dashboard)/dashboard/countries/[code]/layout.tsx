import { getCountryByCode } from "@/lib/queries/countries";
// import type { Metadata } from "next";
// import { useTranslations } from "next-intl";
// import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardCountryLayoutProps extends LayoutProps<"/[locale]/dashboard/countries/[code]"> {}

// export async function generateMetadata(): Promise<Metadata> {
// 	const t = await getTranslations("DashboardCountryLayout");

// 	const title = t("meta.title");

// 	const metadata: Metadata = {
// 		title,
// 		openGraph: {
// 			title,
// 		},
// 	};

// 	return metadata;
// }

export default function DashboardCountryLayout(
	props: Readonly<DashboardCountryLayoutProps>,
): ReactNode {
	const { children, params } = props;

	// const t = useTranslations("DashboardCountryLayout");

	return (
		<div>
			<CountryInfo params={params} />
			{children}
		</div>
	);
}

interface CountryInfoProps extends Pick<DashboardCountryLayoutProps, "params"> {}

async function CountryInfo(props: Readonly<CountryInfoProps>): Promise<ReactNode> {
	const { params } = props;

	const { code } = await params;

	const country = await getCountryByCode({ code });

	if (country == null) {
		notFound();
	}

	return <div>{JSON.stringify(country, null, 2)}</div>;
}
