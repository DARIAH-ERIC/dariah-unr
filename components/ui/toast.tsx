"use client";

import type { ReactNode } from "react";
import { Toaster as ToasterPrimitive, type ToasterProps } from "sonner";
import { twJoin } from "tailwind-merge";

import { useColorScheme } from "@/lib/color-scheme/use-color-scheme";

export function Toast(props: Readonly<ToasterProps>): ReactNode {
	const { colorScheme, kind } = useColorScheme();

	if (kind === "server") {
		return null;
	}

	return (
		<ToasterPrimitive
			// eslint-disable-next-line better-tailwindcss/no-unknown-classes
			className="toaster group"
			richColors={true}
			style={{
				"--normal-bg": "var(--color-overlay)",
				"--normal-text": "var(--color-overlay-fg)",
				"--normal-border": "var(--color-border)",

				"--success-bg": "var(--color-success-subtle)",
				"--success-border": "color-mix(in oklab, var(--success-subtle-fg) 20%, transparent)",
				"--success-text": "var(--color-success-subtle-fg)",

				"--error-bg": "var(--color-danger-subtle)",
				"--error-border": "color-mix(in oklab, var(--danger-subtle-fg) 20%, transparent)",
				"--error-text": "var(--color-danger-subtle-fg)",

				"--warning-bg": "var(--color-warning-subtle)",
				"--warning-border": "color-mix(in oklab, var(--warning-subtle-fg) 20%, transparent)",
				"--warning-text": "var(--color-warning-subtle-fg)",

				"--info-bg": "var(--color-info-subtle)",
				"--info-border": "color-mix(in oklab, var(--info-subtle-fg) 20%, transparent)",
				"--info-text": "var(--color-info-subtle-fg)",
			}}
			theme={colorScheme as ToasterProps["theme"]}
			toastOptions={{
				className: twJoin(
					// eslint-disable-next-line better-tailwindcss/enforce-consistent-class-order
					"*:data-icon:mt-0.5 *:data-icon:self-start not-has-data-[slot=note]:backdrop-blur-3xl has-data-description:*:data-icon:mt-1",
					"**:data-action:[--normal-bg:var(--color-primary-fg)] **:data-action:[--normal-text:var(--color-primary)]",
				),
			}}
			{...props}
		/>
	);
}
