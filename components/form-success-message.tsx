import type { ReactNode } from "react";

interface FormSuccessMessageProps {
	children?: ReactNode;
}

export function FormSuccessMessage(props: FormSuccessMessageProps): ReactNode {
	const { children } = props;

	return (
		<div
			aria-atomic={true}
			aria-live="polite"
			aria-relevant="text"
			className="text-sm text-positive"
		>
			{children}
		</div>
	);
}
