import { isNonNullable } from "@acdh-oeaw/lib";

export function createKey(...values: Array<number | string | null | undefined>): string {
	return values.filter(isNonNullable).join("+");
}
