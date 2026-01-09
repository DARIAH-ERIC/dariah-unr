/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ContainerProps extends ComponentProps<"div"> {
	constrained?: boolean;
}

function Container({ className, constrained = false, ref, ...props }: ContainerProps) {
	return (
		<div
			className={twMerge(
				"mx-auto w-full max-w-7xl [--container-padding:--spacing(4)] xl:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl)",
				constrained ? "sm:px-(--container-padding)" : "px-(--container-padding)",
				className,
			)}
			{...props}
			ref={ref}
		/>
	);
}

export type { ContainerProps };

export { Container };
