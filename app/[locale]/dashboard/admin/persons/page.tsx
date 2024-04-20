import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminPersonsFormContent } from "@/components/admin/persons-form-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getInstitutions } from "@/lib/data/institution";
import { getPersons } from "@/lib/data/person";

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

export default function DashboardAdminPersonsPage(
	props: DashboardAdminPersonsPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminPersonsPage");

	return (
		<MainContent className="container grid content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminPersonsContent />
		</MainContent>
	);
}

function DashboardAdminPersonsContent() {
	return (
		<section>
			<Suspense>
				<AdminPersonsForm />
			</Suspense>
		</section>
	);
}

async function AdminPersonsForm() {
	const [institutions, persons] = await Promise.all([getInstitutions(), getPersons()]);

	return <AdminPersonsFormContent institutions={institutions} persons={persons} />;
}
