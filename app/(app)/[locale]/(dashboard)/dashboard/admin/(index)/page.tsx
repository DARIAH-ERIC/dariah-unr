import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { Link } from "@/components/link";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DashboardAdminPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default function DashboardAdminPage(): ReactNode {
	const t = useTranslations("DashboardAdminPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>

			<ul role="list">
				<li>
					<Link href="/dashboard/admin/contributions">Contributions</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/countries">Countries</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/institutions">Institutions</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/outreach">Outreach</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/persons">Persons</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/projects">Projects</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/reports">Reports</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/services">Services</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/software">Software</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/users">Users</Link>
				</li>
				<li>
					<Link href="/dashboard/admin/working-groups">Working groups</Link>
				</li>
			</ul>
		</Main>
	);
}
