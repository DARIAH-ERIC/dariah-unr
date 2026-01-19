import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
	ArrowLeftStartOnRectangleIcon,
	BriefcaseIcon,
	BuildingOfficeIcon,
	ChatBubbleLeftRightIcon,
	Cog6ToothIcon,
	DocumentTextIcon,
	EnvelopeIcon,
	HomeIcon,
	QuestionMarkCircleIcon,
	TicketIcon,
	UserCircleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import type { ComponentProps, ReactNode } from "react";

import { Avatar } from "@/components/intentui/avatar";
import { Link } from "@/components/intentui/link";
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
import {
	Sidebar,
	SidebarContent,
	SidebarDisclosure,
	SidebarDisclosureGroup,
	SidebarDisclosurePanel,
	SidebarDisclosureTrigger,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
	SidebarRail,
} from "@/components/intentui/sidebar";
import { getCountryById } from "@/lib/data/country";
import { getWorkingGroupsByPersonId } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

export async function DashboardSidebar(
	props: Readonly<ComponentProps<typeof Sidebar>>,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();

	const isAdmin = user.role === "admin";
	const country = user.countryId != null ? await getCountryById({ id: user.countryId }) : null;
	const hasCountry = country != null;
	const contributions =
		user.personId != null ? await getWorkingGroupsByPersonId({ personId: user.personId }) : [];
	const hasWorkingGroups = contributions.length > 0;

	const defaultExpandedKeys = [];

	if (isAdmin) {
		defaultExpandedKeys.push(1);
	}

	if (hasCountry) {
		defaultExpandedKeys.push(2);
	}

	if (hasWorkingGroups) {
		defaultExpandedKeys.push(3);
	}

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Link className="flex items-center gap-x-2" href="/dashboard">
					<Avatar
						className="outline-hidden dark:invert"
						isSquare={true}
						size="sm"
						src="/assets/images/logo.svg"
					/>
					<SidebarLabel className="font-medium">DARIAH-EU</SidebarLabel>
				</Link>
			</SidebarHeader>

			<SidebarContent>
				<SidebarDisclosureGroup
					allowsMultipleExpanded={true}
					defaultExpandedKeys={defaultExpandedKeys}
				>
					{isAdmin ? (
						<SidebarDisclosure id={1}>
							<SidebarDisclosureTrigger>
								<EllipsisHorizontalIcon />
								<SidebarLabel>Administrator</SidebarLabel>
							</SidebarDisclosureTrigger>

							<SidebarDisclosurePanel>
								<SidebarItem href="/dashboard/admin" tooltip="Overview">
									<QuestionMarkCircleIcon />
									<SidebarLabel>Overview</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/contributions" tooltip="Contributions">
									<ChatBubbleLeftRightIcon />
									<SidebarLabel>Contributions</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/countries" tooltip="Countries">
									<QuestionMarkCircleIcon />
									<SidebarLabel>Countries</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/institutions" tooltip="Institutions">
									<BuildingOfficeIcon />
									<SidebarLabel>Institutions</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/outreach" tooltip="Outreach">
									<EnvelopeIcon />
									<SidebarLabel>Outreach</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/persons" tooltip="Persons">
									<UserGroupIcon />
									<SidebarLabel>Persons</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/projects" tooltip="Projects">
									<BriefcaseIcon />
									<SidebarLabel>Projects</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/reports" tooltip="Reports">
									<TicketIcon />
									<SidebarLabel>Reports</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/services" tooltip="Services">
									<QuestionMarkCircleIcon />
									<SidebarLabel>Services</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/software" tooltip="Software">
									<QuestionMarkCircleIcon />
									<SidebarLabel>Software</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/users" tooltip="Users">
									<UserCircleIcon />
									<SidebarLabel>Users</SidebarLabel>
								</SidebarItem>

								<SidebarItem href="/dashboard/admin/working-groups" tooltip="Working groups">
									<QuestionMarkCircleIcon />
									<SidebarLabel>Working groups</SidebarLabel>
								</SidebarItem>

								<SidebarItem
									href="/dashboard/admin/working-group-reports"
									tooltip="Working group reports"
								>
									<QuestionMarkCircleIcon />
									<SidebarLabel>Working group reports</SidebarLabel>
								</SidebarItem>
							</SidebarDisclosurePanel>
						</SidebarDisclosure>
					) : null}

					{hasCountry ? (
						<SidebarDisclosure id={2}>
							<SidebarDisclosureTrigger>
								<EllipsisHorizontalIcon />
								<SidebarLabel>National consortium</SidebarLabel>
							</SidebarDisclosureTrigger>

							<SidebarDisclosurePanel>
								<SidebarItem href={`/dashboard/countries/${country.code}`} tooltip={country.name}>
									<QuestionMarkCircleIcon />
									<SidebarLabel>{country.name}</SidebarLabel>
								</SidebarItem>

								<SidebarItem
									href={`/dashboard/countries/${country.code}/reports`}
									tooltip="Reports"
								>
									<TicketIcon />
									<SidebarLabel>Reports</SidebarLabel>
								</SidebarItem>
							</SidebarDisclosurePanel>
						</SidebarDisclosure>
					) : null}

					{hasWorkingGroups
						? contributions.map((contribution) => {
								const { id, workingGroup } = contribution;

								return (
									<SidebarDisclosure key={id} id={3}>
										<SidebarDisclosureTrigger>
											<EllipsisHorizontalIcon />
											<SidebarLabel>{workingGroup?.name}</SidebarLabel>
										</SidebarDisclosureTrigger>

										<SidebarDisclosurePanel>
											<SidebarItem
												href="/dashboard/working-groups/bibliographic-data"
												tooltip="Metadata"
											>
												<QuestionMarkCircleIcon />
												<SidebarLabel>Metadata</SidebarLabel>
											</SidebarItem>

											<SidebarItem
												href="/dashboard/working-groups/bibliographic-data/reports"
												tooltip="Reports"
											>
												<TicketIcon />
												<SidebarLabel>Reports</SidebarLabel>
											</SidebarItem>
										</SidebarDisclosurePanel>
									</SidebarDisclosure>
								);
							})
						: null}

					{/* <SidebarDisclosure id={4}>
						<SidebarDisclosureTrigger>
							<EllipsisHorizontalIcon />
							<SidebarLabel>Website</SidebarLabel>
						</SidebarDisclosureTrigger>

						<SidebarDisclosurePanel>
							<SidebarItem href="/dashboard/website" tooltip="Overview">
								<QuestionMarkCircleIcon />
								<SidebarLabel>Overview</SidebarLabel>
							</SidebarItem>

							<SidebarItem href="/dashboard/website/metadata" tooltip="Metadata">
								<QuestionMarkCircleIcon />
								<SidebarLabel>Metadata</SidebarLabel>
							</SidebarItem>

							<SidebarItem href="/dashboard/website/pages" tooltip="Pages">
								<QuestionMarkCircleIcon />
								<SidebarLabel>Pages</SidebarLabel>
							</SidebarItem>

							<SidebarItem href="/dashboard/website/events" tooltip="Events">
								<QuestionMarkCircleIcon />
								<SidebarLabel>Events</SidebarLabel>
							</SidebarItem>

							<SidebarItem href="/dashboard/website/news" tooltip="News">
								<QuestionMarkCircleIcon />
								<SidebarLabel>News</SidebarLabel>
							</SidebarItem>

							<SidebarItem
								href="/dashboard/website/impact-case-studies"
								tooltip="Impact case studies"
							>
								<QuestionMarkCircleIcon />
								<SidebarLabel>Impact case studies</SidebarLabel>
							</SidebarItem>
						</SidebarDisclosurePanel>
					</SidebarDisclosure> */}
				</SidebarDisclosureGroup>
			</SidebarContent>

			<SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
				<Menu>
					<MenuTrigger aria-label="Profile" className="flex w-full items-center justify-between">
						<div className="flex items-center gap-x-2">
							<Avatar
								className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
								initials={user.name}
								isSquare={true}
								src={null}
							/>
							<div className="text-sm in-data-[collapsible=dock]:hidden">
								<SidebarLabel>{user.name}</SidebarLabel>
								<span className="-mt-0.5 block truncate text-muted-fg">{user.email}</span>
							</div>
						</div>
						<ChevronUpDownIcon className="shrink-0" data-slot="chevron" />
					</MenuTrigger>

					<MenuContent
						className="min-w-(--trigger-width) in-data-[sidebar-collapsible=collapsed]:min-w-56"
						placement="bottom right"
					>
						<MenuSection>
							<MenuHeader separator={true}>
								<span className="block">{user.name}</span>
								<span className="font-normal text-muted-fg">{user.email}</span>
							</MenuHeader>
						</MenuSection>

						<MenuItem href="#dashboard">
							<HomeIcon />
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
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
