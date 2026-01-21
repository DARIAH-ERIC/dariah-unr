import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardPageProps extends PageProps<"/[locale]/dashboard"> {}

export async function generateMetadata(_props: DashboardPageProps): Promise<Metadata> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardPage(_props: DashboardPageProps): Promise<ReactNode> {
	await assertAuthenticated();

	const _t = await getTranslations("DashboardPage");

	return (
		<main className="grid content-start gap-8">
			<PageTitle>Welcome</PageTitle>

			<div className="prose max-w-(--breakpoint-md)!">
				<p>
					Welcome to DARIAH Reporting! This portal is designed to collect valuable data necessary
					for the evaluation and measurement of DARIAH-EU, its national consortia, and its working
					groups. This information will be used as well to display basic data on our national
					consortia and working groups for the new website.
				</p>
			</div>
		</main>
	);
}
