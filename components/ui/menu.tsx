/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

"use client";

import { CheckIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { type ComponentProps, Fragment, type Ref } from "react";
import {
	Button,
	type ButtonProps,
	Collection,
	composeRenderProps,
	Header,
	Menu as MenuPrimitive,
	MenuItem as MenuItemPrimitive,
	type MenuItemProps as MenuItemPrimitiveProps,
	type MenuProps as MenuPrimitiveProps,
	MenuSection as MenuSectionPrimitive,
	type MenuSectionProps as MenuSectionPrimitiveProps,
	MenuTrigger as MenuTriggerPrimitive,
	type MenuTriggerProps as MenuTriggerPrimitiveProps,
	SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components";
import { twJoin, twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

import { cx } from "@/components/ui/cx";
import {
	DropdownDescription,
	dropdownItemStyles,
	DropdownKeyboard,
	DropdownLabel,
	dropdownSectionStyles,
	DropdownSeparator,
} from "@/components/ui/dropdown";
import { PopoverContent, type PopoverContentProps } from "@/components/ui/popover";

function Menu(props: MenuTriggerPrimitiveProps) {
	return <MenuTriggerPrimitive {...props} />;
}

function MenuSubMenu({ delay = 0, ...props }) {
	return (
		<SubmenuTriggerPrimitive {...props} delay={delay}>
			{props.children}
		</SubmenuTriggerPrimitive>
	);
}

interface MenuTriggerProps extends ButtonProps {
	ref?: Ref<HTMLButtonElement>;
}

function MenuTrigger({ className, ref, ...props }: MenuTriggerProps) {
	return (
		<Button
			ref={ref}
			className={cx(
				"relative inline text-left outline-hidden focus-visible:ring-1 focus-visible:ring-primary",
				"*:data-[slot=chevron]:size-5 sm:*:data-[slot=chevron]:size-4",
				className,
			)}
			data-slot="menu-trigger"
			{...props}
		/>
	);
}

interface MenuContentProps<T>
	extends MenuPrimitiveProps<T>, Pick<PopoverContentProps, "placement"> {
	className?: string;
	popover?: Pick<
		PopoverContentProps,
		| "arrow"
		| "className"
		| "placement"
		| "offset"
		| "crossOffset"
		| "arrowBoundaryOffset"
		| "triggerRef"
		| "isOpen"
		| "onOpenChange"
		| "shouldFlip"
	>;
}

const menuContentStyles = tv({
	base: "grid max-h-[inherit] grid-cols-[auto_1fr] overflow-y-auto overflow-x-hidden overscroll-contain p-1 outline-hidden [clip-path:inset(0_0_0_0_round_calc(var(--radius-xl)-(--spacing(1))))] *:[[role='group']+[role=group]]:mt-1 *:[[role='group']+[role=separator]]:mt-1",
});

function MenuContent<T extends object>({
	className,
	placement,
	popover,
	...props
}: MenuContentProps<T>) {
	return (
		<PopoverContent
			className={cx("min-w-32", popover?.className)}
			placement={placement}
			{...popover}
		>
			<MenuPrimitive
				className={menuContentStyles({ className })}
				data-slot="menu-content"
				{...props}
			/>
		</PopoverContent>
	);
}

interface MenuItemProps extends MenuItemPrimitiveProps, VariantProps<typeof dropdownItemStyles> {}

function MenuItem({ className, intent, children, ...props }: MenuItemProps) {
	const textValue = props.textValue || (typeof children === "string" ? children : undefined);

	return (
		<MenuItemPrimitive
			className={composeRenderProps(className, (className, { hasSubmenu, ...renderProps }) => {
				return dropdownItemStyles({
					...renderProps,
					intent,
					className: hasSubmenu
						? twMerge(
								intent === "danger" && "open:bg-danger-subtle open:text-danger-subtle-fg",
								intent === "warning" && "open:bg-warning-subtle open:text-warning-subtle-fg",
								intent === undefined &&
									"open:bg-accent open:text-accent-fg open:*:data-[slot=icon]:text-accent-fg open:*:[.text-muted-fg]:text-accent-fg",
								className,
							)
						: className,
				});
			})}
			data-slot="menu-item"
			textValue={textValue}
			{...props}
		>
			{(values) => {
				return (
					<Fragment>
						{values.isSelected && (
							<span
								className={twJoin(
									"group-has-data-[slot=avatar]:absolute group-has-data-[slot=avatar]:right-0",
									"group-has-data-[slot=icon]:absolute group-has-data-[slot=icon]:right-0",
								)}
							>
								{values.selectionMode === "single" && (
									<CheckIcon className="-mx-0.5 mr-2 size-4" data-slot="check-indicator" />
								)}
								{values.selectionMode === "multiple" && (
									<CheckIcon className="-mx-0.5 mr-2 size-4" data-slot="check-indicator" />
								)}
							</span>
						)}

						{typeof children === "function" ? children(values) : children}

						{values.hasSubmenu && (
							<ChevronRightIcon className="absolute right-2 size-3.5" data-slot="chevron" />
						)}
					</Fragment>
				);
			}}
		</MenuItemPrimitive>
	);
}

export interface MenuHeaderProps extends ComponentProps<typeof Header> {
	separator?: boolean;
}

function MenuHeader({ className, separator = false, ...props }: MenuHeaderProps) {
	return (
		<Header
			className={twMerge(
				"col-span-full px-2.5 py-2 font-medium text-base sm:text-sm",
				separator && "-mx-1 mb-1 border-b sm:px-3 sm:pb-2.5",
				className,
			)}
			{...props}
		/>
	);
}

const { section, header } = dropdownSectionStyles();

interface MenuSectionProps<T> extends MenuSectionPrimitiveProps<T> {
	ref?: Ref<HTMLDivElement>;
	label?: string;
}

function MenuSection<T extends object>({ className, ref, ...props }: MenuSectionProps<T>) {
	return (
		<MenuSectionPrimitive ref={ref} className={section({ className })} {...props}>
			{"label" in props && <Header className={header()}>{props.label}</Header>}
			<Collection items={props.items}>{props.children}</Collection>
		</MenuSectionPrimitive>
	);
}

const MenuSeparator = DropdownSeparator;
const MenuShortcut = DropdownKeyboard;
const MenuLabel = DropdownLabel;
const MenuDescription = DropdownDescription;

export type { MenuContentProps, MenuItemProps, MenuSectionProps, MenuTriggerProps };

export {
	Menu,
	MenuContent,
	menuContentStyles,
	MenuDescription,
	MenuHeader,
	MenuItem,
	MenuLabel,
	MenuSection,
	MenuSeparator,
	MenuShortcut,
	MenuSubMenu,
	MenuTrigger,
};
