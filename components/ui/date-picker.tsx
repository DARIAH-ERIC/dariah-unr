"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import type { DateDuration } from "@internationalized/date";
import type { ReactNode } from "react";
import {
	Button,
	DatePicker as DatePickerPrimitive,
	type DatePickerProps as DatePickerPrimitiveProps,
	type DateValue,
	type GroupProps,
	type PopoverProps,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { Calendar } from "@/components/ui/calendar";
import { DateInput } from "@/components/ui/date-field";
import { fieldStyles } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input";
import { ModalContent } from "@/components/ui/modal";
import { PopoverContent } from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { cx } from "@/lib/utils/primitive";
import { useIsMobile } from "@/lib/utils/use-mobile";

export interface DatePickerProps<T extends DateValue> extends DatePickerPrimitiveProps<T> {
	popover?: Omit<PopoverProps, "children">;
}

export function DatePicker<T extends DateValue>({
	className,
	children,
	popover,
	...props
}: Readonly<DatePickerProps<T>>): ReactNode {
	return (
		<DatePickerPrimitive className={cx(fieldStyles(), className)} data-slot="control" {...props}>
			{(values) => {
				return (
					<>
						{typeof children === "function" ? children(values) : children}
						<DatePickerOverlay {...popover} />
					</>
				);
			}}
		</DatePickerPrimitive>
	);
}

export interface DatePickerOverlayProps extends Omit<PopoverProps, "children"> {
	range?: boolean;
	visibleDuration?: DateDuration;
	pageBehavior?: "visible" | "single";
}

export function DatePickerOverlay({
	visibleDuration = { months: 1 },
	pageBehavior = "visible",
	placement = "bottom",
	range,
	...props
}: Readonly<DatePickerOverlayProps>): ReactNode {
	const isMobile = useIsMobile();

	return isMobile ? (
		<ModalContent aria-label="Date picker" closeButton={false}>
			<div className="flex justify-center p-6">
				{range ? (
					<RangeCalendar pageBehavior={pageBehavior} visibleDuration={visibleDuration} />
				) : (
					<Calendar />
				)}
			</div>
		</ModalContent>
	) : (
		<PopoverContent
			arrow={false}
			className={twJoin(
				"flex min-w-auto max-w-none snap-x justify-center p-4 sm:min-w-66 sm:p-2 sm:pt-3",
				visibleDuration?.months === 1 ? "sm:max-w-2xs" : "sm:max-w-none",
			)}
			placement={placement}
			{...props}
		>
			{range ? (
				<RangeCalendar pageBehavior={pageBehavior} visibleDuration={visibleDuration} />
			) : (
				<Calendar />
			)}
		</PopoverContent>
	);
}

export function DatePickerTrigger({ className, ...props }: Readonly<GroupProps>): ReactNode {
	return (
		<InputGroup className={cx("*:data-[slot=control]:w-full", className)} {...props}>
			<DateInput />
			<Button
				className={twJoin(
					"touch-target grid place-content-center outline-hidden",
					"text-muted-fg pressed:text-fg hover:text-fg focus-visible:text-fg",
					"px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",
					"*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4",
				)}
				data-slot="date-picker-trigger"
			>
				<CalendarDaysIcon />
			</Button>
		</InputGroup>
	);
}
