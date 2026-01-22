import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getWorkingGroupBySlug } from "@/lib/queries/working-groups";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardWorkingGroupLayoutProps extends LayoutProps<"/[locale]/dashboard/working-groups/[slug]"> {}

export async function generateMetadata(
	props: Readonly<DashboardWorkingGroupLayoutProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupLayout");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardWorkingGroupLayout(
	props: Readonly<DashboardWorkingGroupLayoutProps>,
): Promise<ReactNode> {
	const { children, params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	// const t = await getTranslations("DashboardWorkingGroupLayout");

	return (
		<div>
			<div>{JSON.stringify(workingGroup, null, 2)}</div>
			{children}
		</div>
	);
}
