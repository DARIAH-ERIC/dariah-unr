/* eslint-disable react/jsx-no-literals */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { Link } from "@/components/link";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface DashboardAdminPageProps extends PageProps<"/[locale]/dashboard/admin"> {}

export async function generateMetadata(
	_props: Readonly<DashboardAdminPageProps>,
): Promise<Metadata> {
	const { user } = await assertAuthenticated();

	await assertPermissions(user, { kind: "admin" });

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

export default async function DashboardAdminPage(
	_props: Readonly<DashboardAdminPageProps>,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();

	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminPage");

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
