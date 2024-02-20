import type { ReactNode } from "react";

interface PageLeadInProps {
	children: ReactNode;
}

export function PageLeadIn(props: PageLeadInProps): ReactNode {
	const { children } = props;

	return (
		<div className="max-w-screen-md text-md leading-normal text-neutral-500 dark:text-neutral-400">
			{children}
		</div>
	);
}
