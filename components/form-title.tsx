import type { ReactNode } from "react";

interface FormTitleProps {
	children: ReactNode;
}

export function FormTitle(props: FormTitleProps): ReactNode {
	const { children } = props;

	return (
		<h2 className="text-balance text-md font-semibold leading-tight tracking-tighter text-neutral-950 sm:text-lg md:text-xl dark:text-neutral-0">
			{children}
		</h2>
	);
}
