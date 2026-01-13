"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { type CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { type ComponentProps, type ReactNode, use } from "react";
import {
	Calendar as CalendarPrimitive,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader as CalendarGridHeaderPrimitive,
	CalendarHeaderCell,
	type CalendarProps as CalendarPrimitiveProps,
	CalendarStateContext,
	composeRenderProps,
	type DateValue,
	Heading,
	RangeCalendarStateContext,
	useLocale,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
} from "@/components/ui/select";

export interface CalendarProps<T extends DateValue> extends Omit<
	CalendarPrimitiveProps<T>,
	"visibleDuration"
> {
	className?: string;
}

export function Calendar<T extends DateValue>({
	className,
	...props
}: Readonly<CalendarProps<T>>): ReactNode {
	const now = today(getLocalTimeZone());

	return (
		<CalendarPrimitive data-slot="calendar" {...props}>
			<CalendarHeader />
			<CalendarGrid>
				<CalendarGridHeader />
				<CalendarGridBody>
					{(date) => {
						return (
							<CalendarCell
								className={composeRenderProps(
									className,
									(className, { isSelected, isDisabled }) => {
										return twMerge(
											"relative flex size-11 cursor-default items-center justify-center rounded-lg text-fg tabular-nums outline-hidden hover:bg-secondary-fg/15 sm:size-9 sm:text-sm/6 forced-colors:text-[ButtonText] forced-colors:outline-0",
											isSelected &&
												"bg-primary text-primary-fg pressed:bg-primary hover:bg-primary/90 data-invalid:bg-danger data-invalid:text-danger-fg forced-colors:bg-[Highlight] forced-colors:text-[Highlight] forced-colors:data-invalid:bg-[Mark]",
											isDisabled && "text-muted-fg forced-colors:text-[GrayText]",
											date.compare(now) === 0 &&
												"after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-0.75 after:-translate-x-1/2 after:rounded-full after:bg-primary selected:after:bg-primary-fg focus-visible:after:bg-primary-fg",
											className,
										);
									},
								)}
								date={date}
							/>
						);
					}}
				</CalendarGridBody>
			</CalendarGrid>
		</CalendarPrimitive>
	);
}

export function CalendarHeader({
	isRange,
	className,
	...props
}: Readonly<ComponentProps<"header"> & { isRange?: boolean }>): ReactNode {
	const { direction } = useLocale();

	return (
		<header
			className={twMerge(
				"flex w-full justify-between gap-1.5 pt-1 pr-1 pb-5 pl-1.5 sm:pb-4",
				className,
			)}
			data-slot="calendar-header"
			{...props}
		>
			<div className="flex items-center gap-1.5">
				<SelectMonth />
				<SelectYear />
			</div>
			<Heading className="sr-only" />
			<div className="flex items-center gap-1">
				<Button
					className="size-8 sm:size-7 **:data-[slot=icon]:text-fg"
					intent="plain"
					isCircle={true}
					size="sq-sm"
					slot="previous"
				>
					{direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
				</Button>
				<Button
					className="size-8 sm:size-7 **:data-[slot=icon]:text-fg"
					intent="plain"
					isCircle={true}
					size="sq-sm"
					slot="next"
				>
					{direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</Button>
			</div>
		</header>
	);
}

export interface CalendarDropdown {
	id: number;
	date: CalendarDate;
	formatted: string;
}

export function SelectMonth(): ReactNode {
	const calendarState = use(CalendarStateContext);
	const rangeCalendarState = use(RangeCalendarStateContext);
	const state = calendarState || rangeCalendarState!;
	const formatter = useDateFormatter({
		month: "short",
		timeZone: state.timeZone,
	});

	const months: Array<CalendarDropdown> = [];
	const numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate);
	for (let i = 1; i <= numMonths; i++) {
		const date = state.focusedDate.set({ month: i });
		months.push({
			id: i,
			date,
			formatted: formatter.format(date.toDate(state.timeZone)),
		});
	}

	return (
		<Select
			aria-label="Month"
			className="[popover-width:8rem]"
			onChange={(key) => {
				if (typeof key === "number") {
					state.setFocusedDate(months[key - 1].date);
				}
			}}
			style={{ flex: 1, width: "fit-content" }}
			value={state.focusedDate.month}
		>
			<SelectTrigger className="w-22 text-sm/5 sm:px-2.5 sm:py-1.5 sm:*:text-sm/5 **:data-[slot=select-value]:inline-block **:data-[slot=select-value]:truncate" />
			<SelectContent className="min-w-0" items={months}>
				{(item) => {
					return (
						<SelectItem>
							<SelectLabel>{item.formatted}</SelectLabel>
						</SelectItem>
					);
				}}
			</SelectContent>
		</Select>
	);
}

export function SelectYear(): ReactNode {
	const calendarState = use(CalendarStateContext);
	const rangeCalendarState = use(RangeCalendarStateContext);
	const state = calendarState || rangeCalendarState!;
	const formatter = useDateFormatter({
		year: "numeric",
		timeZone: state.timeZone,
	});

	const years: Array<CalendarDropdown> = [];
	for (let i = -20; i <= 20; i++) {
		const date = state.focusedDate.add({ years: i });
		years.push({
			id: years.length,
			date,
			formatted: formatter.format(date.toDate(state.timeZone)),
		});
	}
	return (
		<Select
			aria-label="Year"
			onChange={(key) => {
				if (typeof key === "number") {
					state.setFocusedDate(years[key].date);
				}
			}}
			value={20}
		>
			<SelectTrigger className="text-sm/5 sm:px-2.5 sm:py-1.5 sm:*:text-sm/5" />
			<SelectContent items={years}>
				{(item) => {
					return (
						<SelectItem>
							<SelectLabel>{item.formatted}</SelectLabel>
						</SelectItem>
					);
				}}
			</SelectContent>
		</Select>
	);
}

export function CalendarGridHeader(): ReactNode {
	return (
		<CalendarGridHeaderPrimitive>
			{(day) => {
				return (
					<CalendarHeaderCell className="pb-2 text-center font-semibold text-muted-fg text-sm/6 sm:px-0 sm:py-0.5 lg:text-xs">
						{day}
					</CalendarHeaderCell>
				);
			}}
		</CalendarGridHeaderPrimitive>
	);
}
