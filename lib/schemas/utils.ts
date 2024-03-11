import { z, type ZodTypeAny } from "zod";

/** Treat empty strings like `undefined`. */
export function nonEmptyString<T extends ZodTypeAny>(schema: T) {
	return z.preprocess((value) => {
		return value === "" ? undefined : value;
	}, schema);
}
