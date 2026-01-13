"use client";

import type { ReactNode } from "react";
import {
	type DialogProps,
	DialogTrigger as DialogTriggerPrimitive,
	type DialogTriggerProps,
	Modal as ModalPrimitive,
	ModalOverlay,
	type ModalOverlayProps,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { cx } from "@/lib/utils/primitive";

import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogCloseIcon,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

export function Modal(props: Readonly<DialogTriggerProps>): ReactNode {
	return <DialogTriggerPrimitive {...props} />;
}

const sizes = {
	"2xs": "sm:max-w-2xs",
	xs: "sm:max-w-xs",
	sm: "sm:max-w-sm",
	md: "sm:max-w-md",
	lg: "sm:max-w-lg",
	xl: "sm:max-w-xl",
	"2xl": "sm:max-w-2xl",
	"3xl": "sm:max-w-3xl",
	"4xl": "sm:max-w-4xl",
	"5xl": "sm:max-w-5xl",
	fullscreen: "",
};

export interface ModalContentProps
	extends
		Omit<ModalOverlayProps, "children">,
		Pick<DialogProps, "aria-label" | "aria-labelledby" | "role" | "children"> {
	size?: keyof typeof sizes;
	closeButton?: boolean;
	isBlurred?: boolean;
	overlay?: Omit<ModalOverlayProps, "children">;
}

export function ModalContent({
	className,
	isDismissable: isDismissableInternal,
	isBlurred = false,
	children,
	overlay,
	size = "lg",
	role = "dialog",
	closeButton = true,
	...props
}: Readonly<ModalContentProps>): ReactNode {
	const isDismissable = isDismissableInternal ?? role !== "alertdialog";

	return (
		<ModalOverlay
			className={twJoin(
				"fixed inset-0 z-50 h-(--visual-viewport-height,100vh) bg-black/15",
				"grid grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr]",
				size === "fullscreen" ? "md:p-3" : "md:p-4",
				"entering:fade-in entering:animate-in entering:duration-300 entering:ease-out",
				"exiting:fade-out exiting:animate-out exiting:ease-in",
				isBlurred && "backdrop-blur-[1px]",
			)}
			data-slot="modal-overlay"
			isDismissable={isDismissable}
			{...props}
		>
			<ModalPrimitive
				className={cx(
					"row-start-2 w-full text-left align-middle",
					"[--visual-viewport-vertical-padding:16px]",
					size === "fullscreen"
						? "sm:rounded-md sm:[--visual-viewport-vertical-padding:16px] **:data-[slot=dialog-body]:min-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding)-var(--dialog-header-height,0px)-var(--dialog-footer-height,0px))]"
						: "sm:rounded-xl sm:[--visual-viewport-vertical-padding:32px]",
					"relative overflow-hidden bg-overlay text-overlay-fg",
					"rounded-t-2xl shadow-lg ring ring-fg/5 dark:ring-border",
					sizes[size],
					"entering:slide-in-from-bottom entering:animate-in entering:duration-300 entering:ease-out sm:entering:zoom-in-95 sm:entering:slide-in-from-bottom-0",
					"exiting:slide-out-to-bottom exiting:animate-out exiting:ease-in sm:exiting:zoom-out-95 sm:exiting:slide-out-to-bottom-0",
					className,
				)}
				data-slot="modal-content"
				{...props}
			>
				<Dialog role={role}>
					{(values) => {
						return (
							<>
								{typeof children === "function" ? children(values) : children}
								{closeButton && <DialogCloseIcon isDismissable={isDismissable} />}
							</>
						);
					}}
				</Dialog>
			</ModalPrimitive>
		</ModalOverlay>
	);
}

export {
	DialogBody as ModalBody,
	DialogClose as ModalClose,
	DialogDescription as ModalDescription,
	DialogFooter as ModalFooter,
	DialogHeader as ModalHeader,
	DialogTitle as ModalTitle,
	DialogTrigger as ModalTrigger,
};
