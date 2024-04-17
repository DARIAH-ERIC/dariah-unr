import { isNonNullable } from "@acdh-oeaw/lib";
import { z, type ZodTypeAny } from "zod";

/** Treat empty strings like `undefined`. */
export function nonEmptyString<T extends ZodTypeAny>(schema: T) {
	return z.preprocess((value) => {
		return value === "" ? undefined : value;
	}, schema);
}

export function checkBox<T extends ZodTypeAny>(schema: T) {
	return z.preprocess((value) => {
		return value === "on" ? true : false;
	}, schema);
}

export function list<T extends ZodTypeAny>(schema: T) {
	return z.preprocess((value) => {
		return Array.isArray(value) ? value.filter(isNonNullable) : value;
	}, schema);
}
