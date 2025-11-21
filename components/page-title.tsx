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
				"text-3xl leading-[1.125] font-bold tracking-tighter text-balance text-neutral-950 md:text-4xl lg:text-5xl dark:text-neutral-0",
				className,
			)}
		>
			{children}
		</h1>
	);
}
