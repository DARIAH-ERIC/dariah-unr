import type { ComponentProps, ReactNode } from "react";

export interface SearchFormProps extends ComponentProps<"form"> {
	children: ReactNode;
	/** @default "search" */
	role?: "form" | "search";
}

export function SearchForm(props: Readonly<SearchFormProps>): ReactNode {
	const { children, role = "search", ...rest } = props;

	return (
		<form {...rest} role={role}>
			{children}
		</form>
	);
}
