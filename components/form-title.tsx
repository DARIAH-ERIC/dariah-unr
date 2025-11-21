import type { ReactNode } from "react";

import { cn } from "@/lib/styles";

interface FormTitleProps {
	children: ReactNode;
	className?: string;
}

export function FormTitle(props: FormTitleProps): ReactNode {
	const { children, className } = props;

	return (
		<h2
			className={cn(
				"text-md leading-tight font-semibold tracking-tighter text-balance text-neutral-950 sm:text-lg md:text-xl dark:text-neutral-0",
				className,
			)}
		>
			{children}
		</h2>
	);
}
