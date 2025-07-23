import { assert } from "@acdh-oeaw/lib";
import { type CalendarDate, parseDate } from "@internationalized/date";

export function toDateValue(value: string | Date): CalendarDate {
	const date = new Date(value);

	assert(!Number.isNaN(date.getTime()), "Invalid Date");

	const year = String(date.getUTCFullYear()).padStart(4, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");

	return parseDate([year, month, day].join("-"));
}
