import type { ReactNode } from "react";

import { cn } from "@/lib/styles";

interface DelayProps {
	children: ReactNode;
	className?: string;
}

export function Delay(props: DelayProps) {
	const { children, className } = props;

	return (
		<div className={cn("delay-500 duration-500 animate-in fade-in fill-mode-both", className)}>
			{children}
		</div>
	);
}
