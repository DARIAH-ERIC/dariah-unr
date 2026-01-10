import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import {
	getWorkingGroupById,
	getWorkingGroupIdFromSlug,
	getWorkingGroups,
} from "@/lib/data/working-group";
import type { IntlLocale } from "@/lib/i18n/locales";
import { createHref } from "@/lib/navigation/create-href";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupsPageProps {
	params: Promise<{
		locale: IntlLocale;
		slug: string;
	}>;
}

export async function generateMetadata(props: DashboardWorkingGroupsPageProps): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardWorkingGroupsPage" });

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const result = await getWorkingGroupIdFromSlug({ slug });
	if (result == null) {
		notFound();
	}
	const { id } = result;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });

	const workingGroup = await getWorkingGroupById({ id });
	if (workingGroup == null) {
		notFound();
	}

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardWorkingGroupsPage(
	props: DashboardWorkingGroupsPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardWorkingGroupsPage");

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const workingGroups = await getWorkingGroups();

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<section className="grid gap-y-8">
				<ul className="flex flex-col gap-y-2" role="list">
					{workingGroups.map((workingGroup) => {
						return (
							<li key={workingGroup.id}>
								<Link
									href={createHref({
										pathname: `/dashboard/working-groups/${workingGroup.slug}`,
									})}
								>
									{workingGroup.name}
								</Link>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
