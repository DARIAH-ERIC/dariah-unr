import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminPersonsTableContent } from "@/components/admin/persons-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getInstitutions } from "@/lib/data/institution";
import { getPersons } from "@/lib/data/person";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminPersonsPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminPersonsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminPersonsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminPersonsPage(
	props: DashboardAdminPersonsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardAdminPersonsPage");

	await assertAuthenticated(["admin"]);

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminPersonsContent />
		</MainContent>
	);
}

function DashboardAdminPersonsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminPersonsForm />
			</Suspense>
		</section>
	);
}

async function AdminPersonsForm() {
	const [institutions, persons] = await Promise.all([getInstitutions(), getPersons()]);

	return <AdminPersonsTableContent institutions={institutions} persons={persons} />;
}
