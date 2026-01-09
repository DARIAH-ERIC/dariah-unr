"use client";

import type { ComponentProps, ReactNode, RefObject } from "react";

import { Link as LinkPrimitive } from "@/components/link";
import { cx } from "@/components/ui/cx";

export interface LinkProps extends ComponentProps<typeof LinkPrimitive> {
	ref?: RefObject<HTMLAnchorElement>;
}

export function Link({ className, ref, ...props }: LinkProps): ReactNode {
	return (
		<LinkPrimitive
			ref={ref}
			className={cx(
				[
					"font-medium text-(--text)",
					"outline-0 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring forced-colors:outline-[Highlight]",
					"disabled:cursor-default disabled:text-muted-fg forced-colors:disabled:text-[GrayText]",
					"href" in props && "cursor-pointer",
				],
				className,
			)}
			{...props}
		/>
	);
}
