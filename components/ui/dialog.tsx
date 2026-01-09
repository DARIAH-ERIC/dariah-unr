/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable better-tailwindcss/no-unknown-classes */

"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { type ComponentProps, type Ref, useEffect, useRef } from "react";
import {
	Button as PrimitiveButton,
	Dialog as PrimitiveDialog,
	Heading,
	type HeadingProps,
	type TextProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";

function Dialog({ role = "dialog", className, ...props }: ComponentProps<typeof PrimitiveDialog>) {
	return (
		<PrimitiveDialog
			className={twMerge(
				"peer/dialog group/dialog relative flex max-h-[inherit] flex-col overflow-hidden outline-hidden [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]",
				className,
			)}
			data-slot="dialog"
			role={role}
			{...props}
		/>
	);
}

function DialogTrigger({ className, ...props }: ButtonProps) {
	return <PrimitiveButton className={cx("cursor-pointer", className)} {...props} />;
}

interface DialogHeaderProps extends Omit<ComponentProps<"div">, "title"> {
	title?: string;
	description?: string;
}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
	const headerRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const header = headerRef.current;
		if (!header) {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				header.parentElement?.style.setProperty(
					"--dialog-header-height",
					`${entry.target.clientHeight}px`,
				);
			}
		});

		observer.observe(header);

		return () => {
			observer.unobserve(header);
		};
	}, []);

	return (
		<div
			ref={headerRef}
			className={twMerge(
				"relative space-y-1 p-(--gutter) pb-[calc(var(--gutter)---spacing(3))]",
				className,
			)}
			data-slot="dialog-header"
		>
			{props.title && <DialogTitle>{props.title}</DialogTitle>}
			{props.description && <DialogDescription>{props.description}</DialogDescription>}
			{!props.title && typeof props.children === "string" ? (
				<DialogTitle {...props} />
			) : (
				props.children
			)}
		</div>
	);
}

interface DialogTitleProps extends HeadingProps {
	ref?: Ref<HTMLHeadingElement>;
}

function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
	return (
		<Heading
			ref={ref}
			className={twMerge("text-balance font-semibold text-fg text-lg/6 sm:text-base/6", className)}
			slot="title"
			{...props}
		/>
	);
}

interface DialogDescriptionProps extends TextProps {
	ref?: Ref<HTMLDivElement>;
}

function DialogDescription({ className, ref, ...props }: DialogDescriptionProps) {
	return (
		<p
			ref={ref}
			className={twMerge(
				"text-pretty text-base/6 text-muted-fg group-disabled:opacity-50 sm:text-sm/6",
				className,
			)}
			data-slot="description"
			{...props}
		/>
	);
}

interface DialogBodyProps extends ComponentProps<"div"> {}

function DialogBody({ className, ref, ...props }: DialogBodyProps) {
	return (
		<div
			ref={ref}
			className={twMerge(
				"isolate flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding)-var(--dialog-header-height,0px)-var(--dialog-footer-height,0px))] flex-1 flex-col overflow-auto px-(--gutter) py-1",
				"**:data-[slot=dialog-footer]:px-0 **:data-[slot=dialog-footer]:pt-0",
				className,
			)}
			data-slot="dialog-body"
			{...props}
		/>
	);
}

interface DialogFooterProps extends ComponentProps<"div"> {}

function DialogFooter({ className, ...props }: DialogFooterProps) {
	const footerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const footer = footerRef.current;

		if (!footer) {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				footer.parentElement?.style.setProperty(
					"--dialog-footer-height",
					`${entry.target.clientHeight}px`,
				);
			}
		});

		observer.observe(footer);
		return () => {
			observer.unobserve(footer);
		};
	}, []);
	return (
		<div
			ref={footerRef}
			className={twMerge(
				"isolate mt-auto flex flex-col-reverse justify-end gap-3 p-(--gutter) pt-[calc(var(--gutter)---spacing(3))] sm:flex-row group-not-has-data-[slot=dialog-body]/dialog:pt-0 group-not-has-data-[slot=dialog-body]/popover:pt-0",
				className,
			)}
			data-slot="dialog-footer"
			{...props}
		/>
	);
}

function DialogClose({ intent = "plain", ref, ...props }: ButtonProps) {
	return <Button ref={ref} intent={intent} slot="close" {...props} />;
}

interface CloseButtonIndicatorProps extends Omit<ButtonProps, "children"> {
	className?: string;
	isDismissable?: boolean | undefined;
}

function DialogCloseIcon({ className, ...props }: CloseButtonIndicatorProps) {
	return props.isDismissable ? (
		<PrimitiveButton
			aria-label="Close"
			className={cx(
				"close absolute top-1 right-1 z-50 grid size-8 place-content-center rounded-xl hover:bg-secondary focus:bg-secondary focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary sm:top-2 sm:right-2 sm:size-7 sm:rounded-md",
				className,
			)}
			slot="close"
		>
			<XMarkIcon className="size-4" />
		</PrimitiveButton>
	) : null;
}

export type {
	CloseButtonIndicatorProps,
	DialogBodyProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogTitleProps,
};

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogCloseIcon,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
