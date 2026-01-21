import type { ReactNode } from "react";

import { cn } from "@/lib/styles";

interface PageTitleProps {
	children: ReactNode;
	className?: string;
}

export function PageTitle(props: PageTitleProps): ReactNode {
	const { children, className } = props;

	return (
		<h1
			className={cn(
				"text-fg tracking-tight font-semibold text-xl/8 text-balance sm:text-2xl/8",
				className,
			)}
		>
			{children}
		</h1>
	);
}
