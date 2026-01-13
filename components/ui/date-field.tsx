"use client";

import type { ReactNode } from "react";
import {
	DateField as DateFieldPrimitive,
	type DateFieldProps,
	DateInput as DateInputPrimitive,
	type DateInputProps,
	DateSegment,
	type DateValue,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { fieldStyles } from "@/components/ui/field";
import { cx } from "@/lib/utils/primitive";

export function DateField<T extends DateValue>({
	className,
	...props
}: Readonly<DateFieldProps<T>>): ReactNode {
	return (
		<DateFieldPrimitive
			{...props}
			className={cx(fieldStyles({ className: "w-fit" }), className)}
			data-slot="control"
		/>
	);
}

export function DateInput({
	className,
	...props
}: Readonly<Omit<DateInputProps, "children">>): ReactNode {
	return (
		<span className="relative block" data-slot="control">
			<DateInputPrimitive
				className={cx(
					"relative block appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
					"text-base/6 text-fg placeholder:text-muted-fg sm:text-sm/6",
					"border border-input enabled:hover:border-muted-fg/30",
					"focus-within:border-ring/70 focus-within:outline-hidden focus-within:ring-3 focus-within:ring-ring/20 focus-within:hover:border-ring/80",
					"group-open:border-ring/70 group-open:outline-hidden group-open:ring-3 group-open:ring-ring/20 group-open:enabled:hover:border-ring/80",
					"invalid:border-danger-subtle-fg/70 invalid:enabled:hover:border-danger-subtle-fg/80 focus-within:invalid:border-danger-subtle-fg/70 focus-within:invalid:ring-danger-subtle-fg/20 focus-within:invalid:hover:border-danger-subtle-fg/80",
					"in-disabled:bg-muted disabled:bg-muted forced-colors:in-disabled:text-[GrayText] forced-colors:disabled:text-[GrayText]",
					"dark:scheme-dark",
					className,
				)}
				{...props}
			>
				{(segment) => {
					return (
						<DateSegment
							className={twJoin(
								"inline shrink-0 rounded-sm px-1 py-0.5 text-fg tracking-wider caret-transparent outline-0 type-literal:px-0 sm:text-sm data-placeholder:not-data-focused:text-muted-fg",
								"focus:bg-primary-subtle focus:text-primary-subtle-fg focus:data-invalid:bg-danger-subtle focus:data-invalid:text-danger-subtle-fg forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText]",
								"forced-color-adjust-none forced-colors:text-[ButtonText]",
								"in-disabled:bg-muted disabled:bg-muted forced-colors:disabled:text-[GrayText]",
							)}
							segment={segment}
						/>
					);
				}}
			</DateInputPrimitive>
		</span>
	);
}
