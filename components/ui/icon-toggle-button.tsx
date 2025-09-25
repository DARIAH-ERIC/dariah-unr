"use client";

import type { ReactNode } from "react";

import { ToggleButton, type ToggleButtonProps } from "@/components/ui/toggle-button";

interface IconToggleButtonProps extends ToggleButtonProps {}

export function IconToggleButton(props: IconToggleButtonProps): ReactNode {
	const { children, ...rest } = props;

	return (
		<ToggleButton {...rest} className="inline-grid aspect-square size-9 place-content-center p-1">
			{children}
		</ToggleButton>
	);
}
