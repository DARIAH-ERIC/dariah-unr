import { type CalendarDate, parseDate } from "@internationalized/date";

export function toDateValue(value: string | Date): CalendarDate {
	const date = new Date(value);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return parseDate([year, month, day].join("-"));
}
