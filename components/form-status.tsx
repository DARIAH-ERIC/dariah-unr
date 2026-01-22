"use client";

import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { FormErrorMessage } from "@/components/form-error-message";
import { FormSuccessMessage } from "@/components/form-success-message";
import { type ActionState, isActionStateError, isActionStateSuccess } from "@/lib/server/actions";

export interface FormStatusProps {
	state: ActionState;
}

export function FormStatus(props: Readonly<FormStatusProps>): ReactNode {
	const { state } = props;

	return (
		<Fragment>
			<FormErrorMessage state={state}>
				{(state) => {
					if (!isActionStateError(state)) {
						return null;
					}

					return (
						<span className="flex items-center gap-x-2">
							<AlertTriangleIcon aria-hidden={true} />
							{state.message}
						</span>
					);
				}}
			</FormErrorMessage>
			<FormSuccessMessage state={state}>
				{(state) => {
					if (!isActionStateSuccess(state)) {
						return null;
					}

					return (
						<span className="flex items-center gap-x-2">
							<CheckCircle2Icon aria-hidden={true} />
							{state.message}
						</span>
					);
				}}
			</FormSuccessMessage>
		</Fragment>
	);
}
