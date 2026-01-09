/* eslint-disable react/jsx-no-literals */

import {
	ArrowLeftStartOnRectangleIcon,
	Cog6ToothIcon,
	DocumentTextIcon,
	Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

import { DashboardBreadcrumbs } from "@/app/(app)/[locale]/(dashboard)/dashboard/_components/dashboard-breadcrumbs";
import { Avatar } from "@/components/ui/avatar";
import {
	Menu,
	MenuContent,
	MenuHeader,
	MenuItem,
	MenuLabel,
	MenuSection,
	MenuSeparator,
	MenuTrigger,
} from "@/components/ui/menu";
import { SidebarNav, SidebarTrigger } from "@/components/ui/sidebar";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";

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

	return (
		<Menu>
			<MenuTrigger aria-label="Open Menu" className="ml-auto md:hidden">
				<Avatar
					initials={user.name}
					isSquare={true}
					src="https://avatars.githubusercontent.com/u/20753323"
				/>
			</MenuTrigger>

			<MenuContent className="min-w-64" popover={{ placement: "bottom end" }}>
				<MenuSection>
					<MenuHeader separator={true}>
						<span className="block">{user.name}</span>
						<span className="font-normal text-muted-fg">{user.email}</span>
					</MenuHeader>
				</MenuSection>

				<MenuItem href="#dashboard">
					<Squares2X2Icon />
					<MenuLabel>Dashboard</MenuLabel>
				</MenuItem>

				<MenuItem href="#account">
					<Cog6ToothIcon />
					<MenuLabel>Account</MenuLabel>
				</MenuItem>

				<MenuSeparator />

				<MenuItem href="#documentation">
					<DocumentTextIcon />
					<MenuLabel>Documentation</MenuLabel>
				</MenuItem>

				<MenuSeparator />

				<MenuItem href="#sign-out">
					<ArrowLeftStartOnRectangleIcon />
					<MenuLabel>Sign out</MenuLabel>
				</MenuItem>
			</MenuContent>
		</Menu>
	);
}
