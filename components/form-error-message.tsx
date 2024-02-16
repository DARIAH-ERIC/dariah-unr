import type { ReactNode } from "react";

interface FormErrorMessageProps {
	children?: ReactNode;
}

export function FormErrorMessage(props: FormErrorMessageProps): ReactNode {
	const { children } = props;

	return (
		<div
			aria-atomic={true}
			aria-live="polite"
			aria-relevant="text"
			className="text-sm text-negative"
		>
			{children}
		</div>
	);
}
