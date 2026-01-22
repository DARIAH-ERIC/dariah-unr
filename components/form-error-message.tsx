import cn from "clsx/lite";
import type { ReactNode } from "react";

import { type ActionState, isActionStateError } from "@/lib/server/actions";

export interface FormErrorMessageProps {
	children?: ReactNode | ((state: ActionState) => ReactNode);
	className?: string;
	state: ActionState;
}

export function FormErrorMessage(props: Readonly<FormErrorMessageProps>): ReactNode {
	const { children, className, state, ...rest } = props;

	const isErrorState = isActionStateError(state);

	// TODO: useRenderProps

	return (
		<div
			{...rest}
			aria-atomic={true}
			aria-live="assertive"
			className={cn(className, !isErrorState ? "sr-only" : null)}
			role="alert"
		>
			{/* eslint-disable-next-line @eslint-react/no-unnecessary-key */}
			<div key={state.id}>
				{isErrorState
					? children != null
						? typeof children === "function"
							? children(state)
							: children
						: state.message
					: null}
			</div>
		</div>
	);
}
