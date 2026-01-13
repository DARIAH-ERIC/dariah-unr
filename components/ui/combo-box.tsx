"use client";

import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import type { ReactNode } from "react";
import {
	Button,
	ComboBox as ComboboxPrimitive,
	ComboBoxContext,
	type ComboBoxProps as ComboboxPrimitiveProps,
	type InputProps,
	ListBox,
	type ListBoxProps,
	type PopoverProps,
	useSlottedContext,
} from "react-aria-components";

import {
	DropdownDescription,
	DropdownItem,
	DropdownLabel,
	DropdownSection,
} from "@/components/ui/dropdown";
import { fieldStyles } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PopoverContent } from "@/components/ui/popover";
import { cx } from "@/lib/utils/primitive";

export interface ComboBoxProps<T extends object> extends Omit<
	ComboboxPrimitiveProps<T>,
	"children"
> {
	children: React.ReactNode;
}

export function ComboBox<T extends object>({
	className,
	...props
}: Readonly<ComboBoxProps<T>>): ReactNode {
	return (
		<ComboboxPrimitive className={cx(fieldStyles(), className)} data-slot="control" {...props} />
	);
}

export interface ComboBoxListProps<T extends object>
	extends Omit<ListBoxProps<T>, "layout" | "orientation">, Pick<PopoverProps, "placement"> {
	popover?: Omit<PopoverProps, "children">;
}

export function ComboBoxContent<T extends object>({
	children,
	items,
	className,
	popover,
	...props
}: Readonly<ComboBoxListProps<T>>): ReactNode {
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
					"grid max-h-96 w-full grid-cols-[auto_1fr] flex-col gap-y-1 p-1 outline-hidden *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1",
					className,
				)}
				items={items}
				layout="stack"
				orientation="vertical"
				{...props}
			>
				{children}
			</ListBox>
		</PopoverContent>
	);
}

export function ComboBoxInput(props: Readonly<InputProps>): ReactNode {
	const context = useSlottedContext(ComboBoxContext)!;

	return (
		<span
			className="relative isolate block has-[[data-slot=icon]:last-child]:[&_input]:pr-10"
			data-slot="control"
		>
			<Input {...props} placeholder={props?.placeholder} />
			<Button className="absolute top-0 right-0 grid h-full w-11 cursor-default place-content-center sm:w-9">
				{!context?.inputValue && (
					<ChevronUpDownIcon className="-mr-1 size-5 text-muted-fg sm:size-4" data-slot="chevron" />
				)}
			</Button>
		</span>
	);
}

export {
	DropdownDescription as ComboBoxDescription,
	DropdownItem as ComboBoxItem,
	DropdownLabel as ComboBoxLabel,
	DropdownSection as ComboBoxSection,
};
