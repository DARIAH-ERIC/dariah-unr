import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { AdminProjectsFundingsTableContent } from "@/components/admin/projects-fundings-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getProjectsFundingLeverages } from "@/lib/data/project-funding-leverage";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminProjectFundingsPageProps extends PageProps<"/[locale]/dashboard/admin/projects"> {}

export async function generateMetadata(
	_props: DashboardAdminProjectFundingsPageProps,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminProjectsFundingsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminProjectFundingsPage(
	_props: DashboardAdminProjectFundingsPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminProjectsFundingsPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
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
