"use client";

import { XCircleIcon } from "@heroicons/react/16/solid";
import type { ReactNode } from "react";
import {
	Button,
	Tag as PrimitiveTag,
	TagGroup as PrimitiveTagGroup,
	type TagGroupProps,
	TagList as PrimitiveTagList,
	type TagListProps,
	type TagProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { cx } from "@/lib/utils/primitive";

export function TagGroup({ className, ...props }: Readonly<TagGroupProps>): ReactNode {
	return (
		<PrimitiveTagGroup
			className={twMerge("flex flex-col gap-y-1 *:data-[slot=label]:font-medium", className)}
			data-slot="control"
			{...props}
		/>
	);
}

export function TagList<T extends object>({
	className,
	...props
}: Readonly<TagListProps<T>>): ReactNode {
	return <PrimitiveTagList className={cx("flex flex-wrap gap-1", className)} {...props} />;
}

export function Tag({ children, className, ...props }: Readonly<TagProps>): ReactNode {
	const textValue = typeof children === "string" ? children : undefined;

	return (
		<PrimitiveTag
			className={cx(
				"inset-ring inset-ring-input outline-hidden dark:bg-input/30",
				"inline-flex items-center gap-x-1.5 py-0.5 font-medium text-xs/5 forced-colors:outline",
				"*:data-[slot=icon]:size-3 *:data-[slot=icon]:shrink-0",
				"cursor-default rounded-full px-2",
				"selected:inset-ring-ring/70 selected:bg-primary-subtle selected:text-primary-subtle-fg",
				"disabled:opacity-50 disabled:forced-colors:text-[GrayText]",
				className,
			)}
			textValue={textValue}
			{...props}
		>
			{({ allowsRemoving }) => {
				return (
					<>
						{children}
						{allowsRemoving && (
							<Button className="" slot="remove">
								<XCircleIcon className="-mr-1 size-4" />
							</Button>
						)}
					</>
				);
			}}
		</PrimitiveTag>
	);
}
