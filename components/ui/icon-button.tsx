"use client";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

interface IconButtonProps extends ButtonProps {}

export function IconButton(props: IconButtonProps): ReactNode {
	const { children, ...rest } = props;

	return (
		<Button {...rest} className="inline-grid aspect-square size-9 place-content-center p-1">
			{children}
		</Button>
	);
}
