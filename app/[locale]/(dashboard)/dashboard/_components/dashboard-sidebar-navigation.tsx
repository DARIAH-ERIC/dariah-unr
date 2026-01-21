import {
	ArrowLeftStartOnRectangleIcon,
	DocumentTextIcon,
	Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

import { DashboardBreadcrumbs } from "@/app/[locale]/(dashboard)/dashboard/_components/dashboard-breadcrumbs";
import { Avatar } from "@/components/intentui/avatar";
import {
	Menu,
	MenuContent,
	MenuHeader,
	MenuItem,
	MenuLabel,
	MenuSection,
	MenuSeparator,
	MenuTrigger,
} from "@/components/intentui/menu";
import { SidebarNav, SidebarTrigger } from "@/components/intentui/sidebar";
import { signOutAction } from "@/lib/actions/auth";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

export function DashboardSidebarNavigation(): ReactNode {
	return (
		<SidebarNav>
			<span className="flex items-center gap-x-4">
				<SidebarTrigger />

				<DashboardBreadcrumbs />
			</span>

			<UserMenu />
		</SidebarNav>
	);
}

async function UserMenu(): Promise<ReactNode> {
	const { user } = await assertAuthenticated();

	function getInitials(name: string): string {
		const segments = name.split(" ");
		if (segments.length < 2) {
			return name.at(0)!;
		}
		return `${name.at(0)!}${name.at(-1)!}`;
	}

	return (
		<Menu>
			<MenuTrigger aria-label="Open Menu" className="ml-auto md:hidden">
				<Avatar initials={getInitials(user.name)} isSquare={true} src={null} />
			</MenuTrigger>

			<MenuContent className="min-w-64" popover={{ placement: "bottom end" }}>
				<MenuSection>
					<MenuHeader separator={true}>
						<span className="block">{user.name}</span>
						<span className="font-normal text-muted-fg">{user.email}</span>
					</MenuHeader>
				</MenuSection>

				<MenuItem href="/dashboard">
					<Squares2X2Icon />
					<MenuLabel>Dashboard</MenuLabel>
				</MenuItem>

				<MenuSeparator />

				<MenuItem href="/documentation/guidelines">
					<DocumentTextIcon />
					<MenuLabel>Documentation</MenuLabel>
				</MenuItem>

				<MenuSeparator />

				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				<MenuItem onAction={signOutAction}>
					<ArrowLeftStartOnRectangleIcon />
					<MenuLabel>Sign out</MenuLabel>
				</MenuItem>
			</MenuContent>
		</Menu>
	);
}
