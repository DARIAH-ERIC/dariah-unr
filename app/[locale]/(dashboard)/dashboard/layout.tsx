import type { ReactNode } from "react";

import { DashboardSidebar } from "@/app/[locale]/(dashboard)/dashboard/_components/dashboard-sidebar";
import { DashboardSidebarNavigation } from "@/app/[locale]/(dashboard)/dashboard/_components/dashboard-sidebar-navigation";
import { SidebarInset, SidebarProvider } from "@/components/intentui/sidebar";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardLayoutProps extends LayoutProps<"/[locale]/dashboard"> {}

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
