import type { ReactNode } from "react";

interface FormDescriptionProps {
	children: ReactNode;
}

export function FormDescription(props: FormDescriptionProps): ReactNode {
	const { children } = props;

	return (
		<div className="max-w-screen-md text-pretty text-sm leading-normal text-neutral-600 dark:text-neutral-400">
			{children}
		</div>
	);
}
