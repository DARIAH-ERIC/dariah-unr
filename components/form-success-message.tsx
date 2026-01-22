import cn from "clsx/lite";
import type { ReactNode } from "react";

import { type ActionState, isActionStateSuccess } from "@/lib/server/actions";

export interface FormSuccessMessageProps {
	children?: ReactNode | ((state: ActionState) => ReactNode);
	className?: string;
	state: ActionState;
}

export function FormSuccessMessage(props: Readonly<FormSuccessMessageProps>): ReactNode {
	const { children, className, state, ...rest } = props;

	const isSuccessState = isActionStateSuccess(state);

	// TODO: useRenderProps

	return (
		<div
			{...rest}
			aria-atomic={true}
			aria-live="polite"
			className={cn(className, !isSuccessState ? "sr-only" : null)}
			role="status"
		>
			{/* eslint-disable-next-line @eslint-react/no-unnecessary-key */}
			<div key={state.id}>
				{isSuccessState
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
