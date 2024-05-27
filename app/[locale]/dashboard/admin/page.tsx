import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { createHref } from "@/lib/create-href";

interface DashboardAdminPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: DashboardAdminPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardAdminPage(props: DashboardAdminPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardAdminPage");

	return (
		<MainContent className="container grid content-start gap-y-8 py-8">
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
						href={createHref({ pathname: "/dashboard/admin/institutions" })}
					>
						Go to institutions
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/outreach" })}
					>
						Go to outreach
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/persons" })}
					>
						Go to persons
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/reports" })}
					>
						Go to reports (comments)
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/services" })}
					>
						Go to services
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/software" })}
					>
						Go to software
					</Link>
				</li>
				<li>
					<Link
						className="grid place-content-center rounded-md border border-neutral-200 px-8 py-4 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
						href={createHref({ pathname: "/dashboard/admin/users" })}
					>
						Go to users
					</Link>
				</li>
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
						href={createHref({ pathname: `/dashboard/admin/statistics/${year}` })}
					>
						Statistics for {year}
					</Link>
				</li>
			</ul>
		</section>
	);
}
