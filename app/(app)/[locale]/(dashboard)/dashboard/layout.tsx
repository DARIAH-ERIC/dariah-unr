import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { DashboardSidebar } from "@/app/(app)/[locale]/(dashboard)/dashboard/_components/dashboard-sidebar";
import { DashboardSidebarNavigation } from "@/app/(app)/[locale]/(dashboard)/dashboard/_components/dashboard-sidebar-navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardLayoutProps extends LayoutProps<"/[locale]/dashboard"> {}

export async function generateMetadata(
	_props: Readonly<DashboardLayoutProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardLayout");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardLayout(
	props: Readonly<DashboardLayoutProps>,
): Promise<ReactNode> {
	const { children } = props;

	await assertAuthenticated();

	return (
		<div className="relative isolate flex h-full flex-col">
			<SidebarProvider>
				<DashboardSidebar intent="float" />

				<SidebarInset>
					<DashboardSidebarNavigation />

					<div className="p-4 lg:p-6">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
