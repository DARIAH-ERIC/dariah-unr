import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { getWorkingGroupBySlug } from "@/lib/queries/working-groups";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { notFound } from "next/navigation";

interface DashboardWorkingGroupPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]"> {}

export async function generateMetadata(
	props: Readonly<DashboardWorkingGroupPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardWorkingGroupPage(
	props: Readonly<DashboardWorkingGroupPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
		</Main>
	);
}
