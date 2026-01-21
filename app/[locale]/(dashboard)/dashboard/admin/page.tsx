import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { createHref } from "@/lib/navigation/create-href";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminPageProps extends PageProps<"/[locale]/dashboard/admin"> {}

export async function generateMetadata(_props: DashboardAdminPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminPage(
	_props: DashboardAdminPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminPage");

	return (
		<MainContent className="grid content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardAdminPageContent />
		</MainContent>
	);
}

function DashboardAdminPageContent() {
	const year = new Date().getUTCFullYear() - 1;

	return (
		<section>
			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,256px),1fr))] gap-4"
				role="list"
			>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/sshomp" })}
					>
						Ingest from SSHOMP
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: `/dashboard/admin/statistics/${String(year)}` })}
					>
						Statistics for {year}
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/campaign" })}
					>
						Reporting campaign
					</Link>
				</li>
			</ul>
		</section>
	);
}
