/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable better-tailwindcss/no-unknown-classes */

"use client";

import type { ComponentProps } from "react";
import { Keyboard as KeyboardPrimitive } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface KeyboardProps extends ComponentProps<typeof KeyboardPrimitive> {}

function Keyboard({ className, ...props }: KeyboardProps) {
	return (
		<KeyboardPrimitive
			className={twMerge(
				"hidden font-mono text-[0.80rem]/6 text-current/60 group-hover:text-fg group-focus:text-fg group-focus:opacity-90 group-disabled:opacity-50 lg:inline forced-colors:group-focus:text-[HighlightText",
				className,
			)}
			data-slot="keyboard"
			{...props}
		/>
	);
}

export type { KeyboardProps };

export { Keyboard };
