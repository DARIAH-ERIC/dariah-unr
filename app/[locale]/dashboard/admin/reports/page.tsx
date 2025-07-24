import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminReportsTableContent } from "@/components/admin/reports-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCountries } from "@/lib/data/country";
import { getReports } from "@/lib/data/report";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminReportsPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminReportsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminReportsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminReportsPage(
	props: DashboardAdminReportsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardAdminReportsPage");

	await assertAuthenticated(["admin"]);

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminReportsPageContent />
		</MainContent>
	);
}

function DashboardAdminReportsPageContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminReportsTable />
			</Suspense>
		</section>
	);
}

async function AdminReportsTable() {
	const [countries, reports] = await Promise.all([getCountries(), getReports()]);

	return <AdminReportsTableContent countries={countries} reports={reports} />;
}
