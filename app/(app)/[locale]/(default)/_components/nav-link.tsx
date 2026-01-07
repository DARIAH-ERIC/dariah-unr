import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import type { ComponentProps, ReactNode } from "react";

import { NavLink as BaseNavLink } from "@/components/nav-link";

const navLinkStyles = styles({
	base: [
		"inline-flex items-center rounded-xs text-text-weak transition duration-200",
		"hover:text-text-strong",
		"outline-2 outline-offset-2 outline-transparent focus-visible:outline-focus-outline",
	],
	variants: {
		size: {
			sm: "gap-x-2 px-1.5 py-0.5 text-xs",
			md: "gap-x-2 px-2.5 py-1 text-sm",
			icon: "touch-target shrink-0 p-1",
		},
	},
	defaults: {
		size: "md",
	},
});

type NavLinkStyleProps = GetVariantProps<typeof navLinkStyles>;

interface NavLinkProps extends ComponentProps<typeof BaseNavLink>, NavLinkStyleProps {}

export function NavLink(props: Readonly<NavLinkProps>): ReactNode {
	const { children, className, size, ...rest } = props;

	return (
		<BaseNavLink {...rest} className={navLinkStyles({ className, size })}>
			{children}
		</BaseNavLink>
	);
}
