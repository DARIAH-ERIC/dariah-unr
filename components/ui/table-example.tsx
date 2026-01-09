/* eslint-disable react/jsx-no-literals */
"use client";

import {
	ClipboardIcon,
	Cog6ToothIcon,
	EllipsisVerticalIcon,
	EnvelopeIcon,
	IdentificationIcon,
	PencilSquareIcon,
	PlusIcon,
	ShieldCheckIcon,
	TrashIcon,
} from "@heroicons/react/16/solid";
import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const users = [
	{
		id: 1,
		name: "Freeda Hansen II",
		username: "elna.anderson",
		email: "jamar90@example.net",
		role: "moderator",
		plan: "Enterprise",
		team: "Engineering",
		organization: "Skiles-Osinski",
		account_type: "company",
		status: "suspended",
		phone: "507-296-7199",
		timezone: "America/Moncton",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 2,
		name: "Dr. Jaclyn Reinger Jr.",
		username: "lockman.geraldine",
		email: "shana77@example.net",
		role: "moderator",
		plan: "Free",
		team: "Marketing",
		organization: "Ernser-Streich",
		account_type: "individual",
		status: "active",
		phone: "820.968.5268",
		timezone: "Europe/Malta",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 3,
		name: "Mr. Hazle Schimmel",
		username: "abbott.stanley",
		email: "schmeler.joanny@example.com",
		role: "moderator",
		plan: "Pro",
		team: "Engineering",
		organization: "Kshlerin LLC",
		account_type: "individual",
		status: "inactive",
		phone: "1-334-566-5763",
		timezone: "Atlantic/South_Georgia",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 4,
		name: "Tatyana Bartoletti",
		username: "myriam.leffler",
		email: "tressie.conn@example.com",
		role: "admin",
		plan: "Free",
		team: "Engineering",
		organization: "Considine LLC",
		account_type: "company",
		status: "active",
		phone: "+1 (248) 315-0295",
		timezone: "Atlantic/Stanley",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 5,
		name: "Dr. Ivy Littel PhD",
		username: "alden19",
		email: "herman.timmothy@example.org",
		role: "moderator",
		plan: "Free",
		team: "Design",
		organization: "Romaguera, Pacocha and Konopelski",
		account_type: "individual",
		status: "inactive",
		phone: "502.384.6216",
		timezone: "America/Thule",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 6,
		name: "Mr. Gaylord Bashirian",
		username: "beverly.ondricka",
		email: "pollich.andreanne@example.net",
		role: "admin",
		plan: "Pro",
		team: "Marketing",
		organization: "Witting Group",
		account_type: "individual",
		status: "inactive",
		phone: "+1-312-939-2551",
		timezone: "Pacific/Saipan",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 7,
		name: "Corene Kub",
		username: "darby15",
		email: "cristian.legros@example.com",
		role: "viewer",
		plan: "Pro",
		team: "Marketing",
		organization: "Cremin, Ebert and Wilderman",
		account_type: "company",
		status: "inactive",
		phone: "(580) 233-2008",
		timezone: "UTC",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 8,
		name: "Jayson Cormier",
		username: "amira.cormier",
		email: "vanessa.okeefe@example.org",
		role: "member",
		plan: "Pro",
		team: "Design",
		organization: "Hintz Group",
		account_type: "company",
		status: "inactive",
		phone: "+1-854-923-6526",
		timezone: "Europe/Lisbon",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 9,
		name: "Prof. Arvel Beier Jr.",
		username: "rboyer",
		email: "adaline.lueilwitz@example.com",
		role: "moderator",
		plan: "Free",
		team: "Engineering",
		organization: "Kuvalis-White",
		account_type: "individual",
		status: "suspended",
		phone: "+1.225.384.5758",
		timezone: "Pacific/Efate",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
	{
		id: 10,
		name: "Pierce Kohler",
		username: "gussie43",
		email: "thettinger@example.com",
		role: "moderator",
		plan: "Enterprise",
		team: "Engineering",
		organization: "Schuster-Block",
		account_type: "individual",
		status: "inactive",
		phone: "+1.435.366.1642",
		timezone: "America/Argentina/San_Luis",
		created_at: "2020-07-20 08:35:05",
		updated_at: "2020-07-20 08:35:05",
	},
];

export function TableExample(): ReactNode {
	const formatter = useFormatter();

	return (
		<Container className="py-6 sm:py-16">
			<CardHeader className="mb-6">
				<CardTitle>Users</CardTitle>
				<CardDescription>
					List of registered users with account status and role information.
				</CardDescription>
				<CardAction>
					<Button intent="secondary">
						<PlusIcon />
						Add user
					</Button>
				</CardAction>
			</CardHeader>

			<Table aria-label="Users">
				<TableHeader>
					<TableColumn className="w-0">#</TableColumn>
					<TableColumn isRowHeader={true}>Name</TableColumn>
					<TableColumn>Username</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Role</TableColumn>
					<TableColumn>Plan</TableColumn>
					<TableColumn>Team</TableColumn>
					<TableColumn>Organization</TableColumn>
					<TableColumn>Account type</TableColumn>
					<TableColumn>Status</TableColumn>
					<TableColumn>Phone</TableColumn>
					<TableColumn>Timezone</TableColumn>
					<TableColumn>Created at</TableColumn>
					<TableColumn>Updated at</TableColumn>
					<TableColumn className="sticky right-0 z-10 bg-linear-to-l from-bg from-60% text-end" />
				</TableHeader>
				<TableBody items={users}>
					{(user) => {
						return (
							<TableRow id={user.id}>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role}</TableCell>
								<TableCell>{user.plan}</TableCell>
								<TableCell>{user.team}</TableCell>
								<TableCell>{user.organization}</TableCell>
								<TableCell>{user.account_type}</TableCell>
								<TableCell>
									<Badge
										intent={
											user.status === "active"
												? "success"
												: user.status === "suspended"
													? "danger"
													: "warning"
										}
									>
										{user.status}
									</Badge>
								</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>{user.timezone}</TableCell>
								<TableCell>{formatter.dateTime(new Date(user.created_at))}</TableCell>
								<TableCell>{formatter.dateTime(new Date(user.updated_at))}</TableCell>
								<TableCell className="sticky right-0 z-10 bg-linear-to-l from-bg from-60% text-end">
									<Menu>
										<Button className="sm:w-7" intent="plain" size="sq-sm">
											<EllipsisVerticalIcon />
										</Button>
										<MenuContent
											className="min-w-46"
											placement="left top"
											popover={{
												className: "dark:bg-overlay/10 dark:backdrop-blur-xl",
											}}
										>
											<MenuItem href="#">
												<IdentificationIcon />
												<MenuLabel>View profile</MenuLabel>
											</MenuItem>
											<MenuItem href="#">
												<PencilSquareIcon />
												<MenuLabel>Edit user</MenuLabel>
											</MenuItem>
											<MenuItem href="#">
												<Cog6ToothIcon />
												<MenuLabel>Change role</MenuLabel>
											</MenuItem>
											<MenuSeparator />
											<MenuItem href="#">
												<ShieldCheckIcon />
												<MenuLabel>Suspend user</MenuLabel>
											</MenuItem>
											<MenuItem href="#">
												<EnvelopeIcon />
												<MenuLabel>Resend invite</MenuLabel>
											</MenuItem>
											<MenuItem
												onAction={() => {
													void navigator.clipboard.writeText(user.email);
												}}
											>
												<ClipboardIcon />
												<MenuLabel>Copy email</MenuLabel>
											</MenuItem>
											<MenuSeparator />
											<MenuItem href="#" intent="danger">
												<TrashIcon />
												<MenuLabel>Delete user</MenuLabel>
											</MenuItem>
										</MenuContent>
									</Menu>
								</TableCell>
							</TableRow>
						);
					}}
				</TableBody>
			</Table>
		</Container>
	);
}
