import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminUsersTableContent } from "@/components/admin/users-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCountries } from "@/lib/data/country";
import { getUsers } from "@/lib/data/user";

interface DashboardAdminUsersPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminUsersPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminUsersPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminUsersPage(props: DashboardAdminUsersPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminUsersPage");

	return (
		<MainContent className="container grid content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminUsersContent />
		</MainContent>
	);
}

function DashboardAdminUsersContent() {
	return (
		<section className="grid gap-y-8">
			<Suspense>
				<AdminUsersForm />
			</Suspense>
		</section>
	);
}

async function AdminUsersForm() {
	const [countries, users] = await Promise.all([getCountries(), getUsers()]);

	return <AdminUsersTableContent countries={countries} users={users} />;
}
