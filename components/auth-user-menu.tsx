"use client";

import { UserIcon } from "lucide-react";
import type { Session } from "next-auth";
import { Header, type Key, Section } from "react-aria-components";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { signOut } from "@/lib/actions/auth";

interface AuthUserMenuProps {
	signOutLabel: string;
	toggleUserMenuLabel: string;
	user: Session["user"];
}

export function AuthUserMenu(props: AuthUserMenuProps) {
	const { signOutLabel, toggleUserMenuLabel, user } = props;

	async function onAction(key: Key) {
		switch (key) {
			case "sign-out": {
				await signOut();
				break;
			}
		}
	}

	return (
		<DropdownMenuTrigger>
			<IconButton variant="plain">
				{user.image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img alt="" className="size-5 shrink-0" src={user.image} />
				) : (
					<UserIcon aria-hidden={true} className="size-5 shrink-0" />
				)}
				<span className="sr-only">{toggleUserMenuLabel}</span>
			</IconButton>
			<DropdownMenu onAction={onAction} placement="bottom">
				<Section>
					<Header className="mb-1.5 border-b px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400">
						Signed in as {user.name}
					</Header>
					<DropdownMenuItem id="sign-out">{signOutLabel}</DropdownMenuItem>
				</Section>
			</DropdownMenu>
		</DropdownMenuTrigger>
	);
}
