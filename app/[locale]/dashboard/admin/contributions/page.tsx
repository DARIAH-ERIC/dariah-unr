import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminContributionsTableContent } from "@/components/admin/contributions-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getContributionsWithDetails } from "@/lib/data/contributions";
import { getCountries } from "@/lib/data/country";
import { getPersons } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";

interface DashboardAdminContributionsPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminContributionsPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminContributionsPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminContributionsPage(
	props: DashboardAdminContributionsPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminContributionsPage");

	return (
		<MainContent className="container grid !max-w-screen-2xl content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminContributionsContent />
		</MainContent>
	);
}

function DashboardAdminContributionsContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminContributionsForm />
			</Suspense>
		</section>
	);
}

async function AdminContributionsForm() {
	const [contributions, countries, persons, roles, workingGroups] = await Promise.all([
		getContributionsWithDetails(),
		getCountries(),
		getPersons(),
		getRoles(),
		getWorkingGroups(),
	]);

	return (
		<AdminContributionsTableContent
			contributions={contributions}
			countries={countries}
			persons={persons}
			roles={roles}
			workingGroups={workingGroups}
		/>
	);
}
