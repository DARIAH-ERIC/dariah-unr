import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends ComponentProps<"div"> {
	soft?: boolean;
}

export function Skeleton({
	ref,
	soft = false,
	className,
	...props
}: Readonly<SkeletonProps>): ReactNode {
	return (
		<div
			ref={ref}
			className={twMerge(
				"shrink-0 animate-pulse rounded-lg",
				soft ? "bg-muted-fg/20" : "bg-muted-fg/40",
				className,
			)}
			data-slot="skeleton"
			{...props}
		/>
	);
}
