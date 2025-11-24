import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getWorkingGroupById } from "@/lib/data/working-group";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardWorkingGroupPageProps {
	params: Promise<{
		id: string;
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(props: DashboardWorkingGroupPageProps): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardWorkingGroupPage" });

	const { user } = await assertAuthenticated();

	const { id } = await params;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });
	// TODO: return 403

	const workingGroup = await getWorkingGroupById({ id });
	if (workingGroup == null) {
		notFound();
	}

	const metadata: Metadata = {
		title: t("meta.title", { name: workingGroup.name }),
	};

	return metadata;
}

export default async function DashboardWorkingGroupPage(
	props: DashboardWorkingGroupPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardWorkingGroupPage");

	const { user } = await assertAuthenticated();

	const { id } = await params;

	await assertPermissions(user, { kind: "working-group", id, action: "read" });
	// TODO: return 403

	const workingGroup = await getWorkingGroupById({ id });
	if (workingGroup == null) {
		notFound();
	}

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title", { name: workingGroup.name })}</PageTitle>

			<pre>{JSON.stringify(workingGroup, null, 2)}</pre>
		</MainContent>
	);
}
