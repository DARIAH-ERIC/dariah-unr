"use client";

import { chain } from "@react-aria/utils";
import { XIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, type ElementRef, useContext } from "react";
import {
	Button as AriaDialogCloseButton,
	type ButtonProps as AriaDialogCloseButtonProps,
	composeRenderProps,
	Dialog as AriaDialog,
	type DialogProps as AriaDialogProps,
	DialogTrigger as AriaDialogTrigger,
	type DialogTriggerProps as AriaDialogTriggerProps,
	Heading as AriaDialogTitle,
	type HeadingProps as AriaDialogTitleProps,
	OverlayTriggerStateContext as AriaOverlayTriggerStateContext,
	Text as AriaDialogDescription,
	type TextProps as AriaDialogDescriptionProps,
} from "react-aria-components";

import {
	Button as AriaDialogActionButton,
	Button as AriaDialogCancelButton,
	type ButtonProps as AriaDialogActionButtonProps,
	type ButtonProps as AriaDialogCancelButtonProps,
} from "@/components/ui/button";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export { AriaDialogTrigger as DialogTrigger, type AriaDialogTriggerProps as DialogTriggerProps };

export const dialogStyles = variants({
	base: [
		"outline outline-0",
		"relative grid max-h-[inherit] min-w-96 max-w-screen-sm content-start gap-y-6 overflow-auto",
		"rounded-md",
		"bg-neutral-0 dark:bg-neutral-900",
		"border border-neutral-950/10",
		"shadow-lg",
		"p-6",
	],
});

export type DialogStyles = VariantProps<typeof dialogStyles>;

export interface DialogProps extends AriaDialogProps, DialogStyles {}

export const Dialog = forwardRef(function Dialog(
	props: DialogProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaDialog>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaDialog ref={forwardedRef} {...rest} className={dialogStyles({ className })}>
			{children}
		</AriaDialog>
	);
});

export const dialogHeaderStyles = variants({
	base: ["flex flex-col gap-y-2"],
});

export type DialogHeaderStyles = VariantProps<typeof dialogHeaderStyles>;

export interface DialogHeaderProps extends ComponentPropsWithoutRef<"header">, DialogHeaderStyles {}

export const DialogHeader = forwardRef(function DialogHeader(
	props: DialogHeaderProps,
	forwardedRef: ForwardedRef<ElementRef<"header">>,
) {
	const { children, className, ...rest } = props;

	return (
		<header ref={forwardedRef} {...rest} className={dialogHeaderStyles({ className })}>
			{children}
		</header>
	);
});

export const dialogTitleStyles = variants({
	base: [
		"text-balance text-md font-semibold leading-tight tracking-tight text-neutral-950 dark:text-neutral-0",
	],
});

export type DialogTitleStyles = VariantProps<typeof dialogTitleStyles>;

export interface DialogTitleProps extends AriaDialogTitleProps, DialogTitleStyles {}

export const DialogTitle = forwardRef(function DialogTitle(
	props: DialogTitleProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaDialogTitle>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaDialogTitle
			ref={forwardedRef}
			{...rest}
			className={dialogTitleStyles({ className })}
			slot="title"
		>
			{children}
		</AriaDialogTitle>
	);
});

export const dialogDescriptionStyles = variants({
	base: ["text-pretty text-sm leading-normal text-neutral-600 dark:text-neutral-400"],
});

export type DialogDescriptionStyles = VariantProps<typeof dialogDescriptionStyles>;

export interface DialogDescriptionProps
	extends AriaDialogDescriptionProps,
		DialogDescriptionStyles {}

export const DialogDescription = forwardRef(function DialogDescription(
	props: DialogDescriptionProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaDialogDescription>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaDialogDescription
			ref={forwardedRef}
			{...rest}
			className={dialogDescriptionStyles({ className })}
			slot="description"
		>
			{children}
		</AriaDialogDescription>
	);
});

export const dialogFooterStyles = variants({
	base: ["flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"],
});

export type DialogFooterStyles = VariantProps<typeof dialogFooterStyles>;

export interface DialogFooterProps extends ComponentPropsWithoutRef<"footer">, DialogFooterStyles {}

export const DialogFooter = forwardRef(function DialogFooter(
	props: DialogFooterProps,
	forwardedRef: ForwardedRef<ElementRef<"footer">>,
) {
	const { children, className, ...rest } = props;

	return (
		<footer ref={forwardedRef} {...rest} className={dialogFooterStyles({ className })}>
			{children}
		</footer>
	);
});

export const dialogCloseButtonStyles = variants({
	base: [
		"absolute right-4 top-4 cursor-default transition",
		"rounded-sm",
		"opacity-70 hover:opacity-100 pressed:opacity-90",
	],
});

export type DialogCloseButtonStyles = VariantProps<typeof dialogCloseButtonStyles>;

export interface DialogCloseButtonProps
	extends Omit<AriaDialogCloseButtonProps, "children">,
		DialogCloseButtonStyles {
	"aria-label": string;
}

export const DialogCloseButton = forwardRef(function DialogCloseButton(
	props: DialogCloseButtonProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaDialogCloseButton>>,
) {
	const { className, onPress, ...rest } = props;

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { close } = useContext(AriaOverlayTriggerStateContext);

	return (
		<AriaDialogCloseButton
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return dialogCloseButtonStyles({ ...renderProps, className });
			})}
			onPress={chain(onPress, close)}
		>
			<XIcon aria-hidden={true} className="size-4 shrink-0" />
		</AriaDialogCloseButton>
	);
});

export const dialogCancelButtonStyles = variants({
	base: [],
});

export type DialogCancelButtonStyles = VariantProps<typeof dialogCancelButtonStyles>;

export interface DialogCancelButtonProps
	extends AriaDialogCancelButtonProps,
		DialogCancelButtonStyles {}

export const DialogCancelButton = forwardRef(function DialogCancelButton(
	props: DialogCancelButtonProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaDialogCancelButton>>,
) {
	const { children, className, onPress, variant = "plain", ...rest } = props;

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { close } = useContext(AriaOverlayTriggerStateContext);

	return (
		<AriaDialogCancelButton
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return dialogCancelButtonStyles({ ...renderProps, className });
			})}
			onPress={chain(onPress, close)}
			variant={variant}
		>
			{children}
		</AriaDialogCancelButton>
	);
});

export const dialogActionButtonStyles = variants({
	base: [],
});

export type DialogActionButtonStyles = VariantProps<typeof dialogActionButtonStyles>;

export interface DialogActionButtonProps
	extends AriaDialogActionButtonProps,
		DialogActionButtonStyles {}

export const DialogActionButton = forwardRef(function DialogActionButton(
	props: DialogActionButtonProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaDialogActionButton>>,
) {
	const { children, className, onPress, ...rest } = props;

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { close } = useContext(AriaOverlayTriggerStateContext);

	return (
		<AriaDialogActionButton
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return dialogActionButtonStyles({ ...renderProps, className });
			})}
			onPress={chain(onPress, close)}
		>
			{children}
		</AriaDialogActionButton>
	);
});
