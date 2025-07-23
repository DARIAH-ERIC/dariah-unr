import { assert } from "@acdh-oeaw/lib";
import { CalendarDate } from "@internationalized/date";

export function toDateValue(value: string | Date): CalendarDate {
	const date = new Date(value);

	assert(!Number.isNaN(date.getTime()), "Invalid Date");

	return new CalendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}
