import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminSshompIngestFormContent } from "@/components/admin/sshomp-ingest-form-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminSshompIngestPageProps extends PageProps<"/[locale]/dashboard/admin/sshomp"> {}

export async function generateMetadata(
	_props: DashboardAdminSshompIngestPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminSshompIngestPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminSshompIngestPage(
	_props: DashboardAdminSshompIngestPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminSshompIngestPage");

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminSshompIngestContent />
		</MainContent>
	);
}

function DashboardAdminSshompIngestContent() {
	return (
		<section className="grid gap-y-8">
			<AdminSshompIngestFormContent />
		</section>
	);
}
