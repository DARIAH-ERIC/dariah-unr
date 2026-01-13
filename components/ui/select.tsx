"use client";

import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import type { ComponentProps, ReactNode } from "react";
import {
	Button,
	ListBox,
	type ListBoxProps,
	type PopoverProps,
	Select as SelectPrimitive,
	type SelectProps as SelectPrimitiveProps,
	SelectValue,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import {
	DropdownDescription,
	DropdownItem,
	DropdownLabel,
	DropdownSection,
	DropdownSeparator,
} from "@/components/ui/dropdown";
import { fieldStyles } from "@/components/ui/field";
import { PopoverContent } from "@/components/ui/popover";
import { cx } from "@/lib/utils/primitive";

export interface SelectProps<
	T extends object,
	M extends "single" | "multiple" = "single",
> extends SelectPrimitiveProps<T, M> {
	items?: Iterable<T, M>;
}

export function Select<T extends object, M extends "single" | "multiple" = "single">({
	className,
	...props
}: Readonly<SelectProps<T, M>>): ReactNode {
	return (
		<SelectPrimitive
			className={cx(fieldStyles({ className: "group/select" }), className)}
			data-slot="control"
			{...props}
		/>
	);
}

export interface SelectListProps<T extends object> extends Omit<
	ListBoxProps<T>,
	"layout" | "orientation"
> {
	items?: Iterable<T>;
	popover?: Omit<PopoverProps, "children">;
}

export function SelectContent<T extends object>({
	items,
	className,
	popover,
	...props
}: Readonly<SelectListProps<T>>): ReactNode {
	return (
		<PopoverContent
			className={cx(
				"min-w-(--trigger-width) scroll-py-1 overflow-y-auto overscroll-contain",
				popover?.className,
			)}
			placement={popover?.placement ?? "bottom"}
			{...popover}
		>
			<ListBox
				className={cx(
					"grid max-h-96 w-full grid-cols-[auto_1fr] flex-col gap-y-1 overflow-y-auto p-1 outline-hidden *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1",
					className,
				)}
				items={items}
				layout="stack"
				orientation="vertical"
				{...props}
			/>
		</PopoverContent>
	);
}

export interface SelectTriggerProps extends ComponentProps<typeof Button> {
	prefix?: ReactNode;
	className?: string;
}

export function SelectTrigger({
	children,
	className,
	...props
}: Readonly<SelectTriggerProps>): ReactNode {
	return (
		<span className="relative block w-full" data-slot="control">
			<Button
				className={cx(
					"group/select-trigger flex w-full min-w-0 cursor-default items-center gap-x-2 rounded-lg border border-input px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-start text-fg outline-hidden transition duration-200 sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6 sm:*:text-sm/6 dark:shadow-none",
					"focus:border-ring/70 focus:ring-3 focus:ring-ring/20 focus:enabled:hover:border-ring/80",
					"enabled:hover:border-muted-fg/30",
					"group-open/select:border-ring/70 group-open/select:ring-3 group-open/select:ring-ring/20",
					"group-invalid/select:border-danger-subtle-fg/70 group-invalid/select:ring-danger-subtle-fg/20 group-invalid/select:enabled:hover:border-danger-subtle-fg/80 group-open/select:invalid:border-danger-subtle-fg/70 group-open/select:invalid:ring-3 group-open/select:invalid:ring-danger-subtle-fg/20 group-focus/select:group-invalid/select:border-danger-subtle-fg/70 group-focus/select:group-invalid/select:ring-danger-subtle-fg/20 group-focus/select:group-invalid/select:enabled:hover:border-danger-subtle-fg/80",
					"forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText] *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) pressed:*:data-[slot=icon]:text-(--btn-icon-active) focus-visible:*:data-[slot=icon]:text-(--btn-icon-active)/80 enabled:hover:*:data-[slot=icon]:text-(--btn-icon-active)/90 sm:*:data-[slot=icon]:size-4",
					"*:data-[slot=loader]:size-5 *:data-[slot=loader]:shrink-0 *:data-[slot=loader]:self-center *:data-[slot=loader]:text-(--btn-icon) sm:*:data-[slot=loader]:size-4",
					"forced-colors:group-focus/select:border-[Highlight] forced-colors:group-focus/select:group-invalid/select:border-[Mark] forced-colors:group-invalid/select:border-[Mark]",
					"group-disabled/select:bg-muted group-disabled/select:opacity-50 forced-colors:group-disabled/select:border-[GrayText] forced-colors:group-disabled/select:text-[GrayText]",
					"in-disabled:bg-muted in-disabled:opacity-50 forced-colors:in-disabled:border-[GrayText] forced-colors:in-disabled:text-[GrayText]",
					"dark:scheme-dark",
					className,
				)}
			>
				{(values) => {
					return (
						<>
							{props.prefix && <span className="text-muted-fg">{props.prefix}</span>}
							{typeof children === "function" ? children(values) : children}

							{!children && (
								<>
									<SelectValue
										className={twJoin([
											"truncate text-start data-placeholder:text-muted-fg sm:text-sm/6 **:[[slot=description]]:hidden",
											"has-data-[slot=avatar]:grid has-data-[slot=avatar]:grid-cols-[1fr_auto] has-data-[slot=avatar]:items-center has-data-[slot=avatar]:gap-x-2",
											"has-data-[slot=icon]:grid has-data-[slot=icon]:grid-cols-[1fr_auto] has-data-[slot=icon]:items-center has-data-[slot=icon]:gap-x-2",
											"*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4",
											"*:mt-0 *:data-[slot=avatar]:[--avatar-size:--spacing(5)] sm:*:data-[slot=avatar]:[--avatar-size:--spacing(4.5)]",
										])}
										data-slot="select-value"
									/>
									<ChevronUpDownIcon
										className="-mr-1 ml-auto size-5 text-muted-fg sm:size-4"
										data-slot="chevron"
									/>
								</>
							)}
						</>
					);
				}}
			</Button>
		</span>
	);
}

export {
	DropdownDescription as SelectDescription,
	DropdownItem as SelectItem,
	DropdownLabel as SelectLabel,
	DropdownSection as SelectSection,
	DropdownSeparator as SelectSeparator,
};
