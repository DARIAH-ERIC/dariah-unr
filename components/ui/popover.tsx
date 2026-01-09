/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

"use client";

import type { Ref } from "react";
import {
	DialogTrigger as DialogTriggerPrimitive,
	type DialogTriggerProps,
	OverlayArrow,
	Popover as PopoverPrimitive,
	type PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components";

import { cx } from "@/components/ui/cx";
import {
	DialogBody,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type PopoverProps = DialogTriggerProps;

function Popover(props: PopoverProps) {
	return <DialogTriggerPrimitive {...props} />;
}

const PopoverTitle = DialogTitle;
const PopoverHeader = DialogHeader;
const PopoverBody = DialogBody;
const PopoverFooter = DialogFooter;

interface PopoverContentProps extends PopoverPrimitiveProps {
	arrow?: boolean;
	ref?: Ref<HTMLDivElement>;
}

function PopoverContent({
	children,
	arrow = false,
	className,
	ref,
	...props
}: PopoverContentProps) {
	const offset = props.offset ?? (arrow ? 12 : 8);

	return (
		<PopoverPrimitive
			ref={ref}
			className={cx(
				"group/popover min-w-(--trigger-width) max-w-xs origin-(--trigger-anchor-point) rounded-(--popover-radius) border border-fg/10 bg-overlay text-overlay-fg shadow-xs outline-hidden transition-transform [--gutter:--spacing(6)] [--popover-radius:var(--radius-xl)] sm:text-sm dark:backdrop-saturate-200 **:[[role=dialog]]:[--gutter:--spacing(4)]",
				"entering:fade-in entering:animate-in",
				"exiting:fade-out exiting:animate-out",
				"placement-left:entering:slide-in-from-right-1 placement-right:entering:slide-in-from-left-1 placement-top:entering:slide-in-from-bottom-1 placement-bottom:entering:slide-in-from-top-1",
				"placement-left:exiting:slide-out-to-right-1 placement-right:exiting:slide-out-to-left-1 placement-top:exiting:slide-out-to-bottom-1 placement-bottom:exiting:slide-out-to-top-1",
				"forced-colors:bg-[Canvas]",
				className,
			)}
			offset={offset}
			{...props}
		>
			{(values) => {
				return (
					<>
						{arrow && (
							<OverlayArrow className="group">
								<svg
									className="block fill-overlay stroke-border group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
									height={12}
									viewBox="0 0 12 12"
									width={12}
								>
									<path d="M0 0 L6 6 L12 0" />
								</svg>
							</OverlayArrow>
						)}
						{typeof children === "function" ? children(values) : children}
					</>
				);
			}}
		</PopoverPrimitive>
	);
}

const PopoverTrigger = DialogTrigger;
const PopoverClose = DialogClose;
const PopoverDescription = DialogDescription;

export type { PopoverContentProps, PopoverProps };

export {
	Popover,
	PopoverBody,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverFooter,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
};
