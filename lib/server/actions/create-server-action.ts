import { log } from "@acdh-oeaw/lib";
import { unstable_rethrow as rethrow } from "next/navigation";
import { getTranslations } from "next-intl/server";

import {
	type ActionState,
	createActionStateError,
	type ValidationErrors,
} from "@/lib/server/actions";
import { globalPOSTRateLimit } from "@/lib/server/rate-limit/global-rate-limit";

type ServerAction<
	TData = unknown,
	TValidationErrors extends ValidationErrors = ValidationErrors,
> = (
	state: ActionState<TData, TValidationErrors>,
	formData: FormData,
) => Promise<ActionState<TData, TValidationErrors>>;

export function createServerAction<
	TData = unknown,
	TValidationErrors extends ValidationErrors = ValidationErrors,
>(fn: ServerAction<TData, TValidationErrors>): ServerAction<TData, TValidationErrors> {
	return async (state: ActionState<TData, TValidationErrors>, formData: FormData) => {
		const e = await getTranslations("errors");

		try {
			if (!(await globalPOSTRateLimit())) {
				return createActionStateError({ message: e("too-many-requests") });
			}

			return await fn(state, formData);
		} catch (error) {
			rethrow(error);

			log.error(error);

			return createActionStateError({
				formData,
				message: e("internal-server-error"),
			});
		}
	};
}
