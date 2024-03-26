import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { createHref } from "@/lib/create-href";

interface DashboardAdminPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminPage(props: DashboardAdminPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminPage");

	return (
		<MainContent className="container grid content-start gap-y-4 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminPageContent />
		</MainContent>
	);
}

function DashboardAdminPageContent() {
	return (
		<section>
			<ul role="list">
				<li>
					<Link href={createHref({ pathname: "/dashboard/admin/users" })}>Edit users</Link>
				</li>
				<li>
					<Link href={createHref({ pathname: "/dashboard/admin/institutions" })}>
						Edit institutions
					</Link>
				</li>
				<li>
					<Link href={createHref({ pathname: "/dashboard/admin/sshomp" })}>
						Ingest software and services from SSH Open Marketplace
					</Link>
				</li>
			</ul>
		</section>
	);
}
