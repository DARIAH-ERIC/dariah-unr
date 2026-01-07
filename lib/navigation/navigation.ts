/* eslint-disable @typescript-eslint/no-restricted-imports */

import { createNavigation } from "next-intl/navigation";
import type { ComponentProps, ReactNode } from "react";

import { routing } from "@/lib/i18n/routing";

const {
	Link,
	getPathname,
	redirect: _redirect,
	usePathname,
	useRouter,
} = createNavigation(routing);

/** @see {@link https://github.com/amannn/next-intl/issues/823} */
const redirect: typeof _redirect = _redirect;

export { getPathname, redirect, usePathname, useRouter };

export { useSearchParams } from "next/navigation";

export interface LocaleLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
	href: string | undefined;
}

export const LocaleLink = Link as (props: LocaleLinkProps) => ReactNode;

//

export interface NavigationAction {
	type: "action";
	label: string;
	icon?: ReactNode;
	onAction: () => void;
}

export interface NavigationLink {
	type: "link";
	label: string;
	icon?: ReactNode;
	href: string;
}

export interface NavigationSeparator {
	type: "separator";
}

export type NavigationMenuItem = NavigationLink | NavigationSeparator | NavigationAction;

export interface NavigationMenu {
	type: "menu";
	label: string;
	icon?: ReactNode;
	children: Record<string, NavigationMenuItem>;
}

export type NavigationItem =
	| NavigationAction
	| NavigationLink
	| NavigationSeparator
	| NavigationMenu;

export type NavigationConfig = Record<string, NavigationItem>;
