import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminProjectsFundingsTableContent } from "@/components/admin/projects-fundings-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getProjectsFundingLeverages } from "@/lib/data/project-funding-leverage";

interface DashboardAdminProjectFundingsPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminProjectFundingsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminProjectsFundingsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminProjectFundingsPage(
	props: DashboardAdminProjectFundingsPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminProjectsFundingsPage");

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminProjectFundingsContent />
		</MainContent>
	);
}

function DashboardAdminProjectFundingsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminProjectFundingsForm />
			</Suspense>
		</section>
	);
}

async function AdminProjectFundingsForm() {
	const [projectsFundingLeverages] = await Promise.all([getProjectsFundingLeverages()]);

	return <AdminProjectsFundingsTableContent projectsFundingLeverages={projectsFundingLeverages} />;
}
