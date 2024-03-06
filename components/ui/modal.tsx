"use client";

import type { ElementRef } from "react";
import {
	composeRenderProps,
	Modal as AriaModal,
	ModalOverlay as AriaModalOverlay,
	type ModalOverlayProps as AriaModalOverlayProps,
	type ModalOverlayProps as AriaModalProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const modalOverlayStyles = variants({
	base: [
		"fixed inset-0 flex justify-center overflow-y-auto",
		"bg-neutral-950/25 dark:bg-neutral-950/50",
	],
});

export type ModalOverlayStyles = VariantProps<typeof modalOverlayStyles>;

export interface ModalOverlayProps extends AriaModalOverlayProps, ModalOverlayStyles {}

export const ModalOverlay = forwardRef(function ModalOverlay(
	props: ModalOverlayProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaModalOverlay>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaModalOverlay
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return modalOverlayStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaModalOverlay>
	);
});

export const modalStyles = variants({
	base: [
		"fixed inset-0 grid min-h-full w-full place-content-center overflow-y-auto pt-6 sm:p-4 sm:pt-0",
	],
});

export type ModalStyles = VariantProps<typeof modalStyles>;

export interface ModalProps extends AriaModalProps, ModalStyles {}

export const Modal = forwardRef(function Modal(
	props: ModalProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaModal>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaModal
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return modalStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaModal>
	);
});
