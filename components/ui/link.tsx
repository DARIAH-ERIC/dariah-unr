"use client";

import type { ElementRef } from "react";
import {
	composeRenderProps,
	Link as AriaLink,
	type LinkProps as AriaLinkProps,
} from "react-aria-components";

import { TouchTarget } from "@/components/ui/touch-target";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const linkStyles = variants({
	base: [
		"underline transition",
		"text-sm leading-normal",
		"text-neutral-950 decoration-neutral-950/50 underline-offset-4 hover:decoration-neutral-950 dark:text-neutral-0 dark:decoration-neutral-0/50 dark:hover:decoration-neutral-0",
	],
});

export type LinkStyles = VariantProps<typeof linkStyles>;

export interface LinkProps extends AriaLinkProps, LinkStyles {}

export const Link = forwardRef(function Link(
	props: LinkProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaLink>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaLink
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return linkStyles({ ...renderProps, className });
			})}
		>
			{composeRenderProps(children, (children, _renderProps) => {
				return <TouchTarget>{children}</TouchTarget>;
			})}
		</AriaLink>
	);
});
