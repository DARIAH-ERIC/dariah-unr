import type { ReactNode } from "react";

import { cn } from "@/lib/styles";

interface FormDescriptionProps {
	children: ReactNode;
	className?: string;
}

export function FormDescription(props: FormDescriptionProps): ReactNode {
	const { children, className } = props;

	return (
		<div className={cn("prose prose-sm max-w-(--breakpoint-md) text-pretty", className)}>
			{children}
		</div>
	);
}
