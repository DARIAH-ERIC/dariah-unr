import { range } from "@acdh-oeaw/lib";

const years = range(2022, new Date().getUTCFullYear() - 1).map(String);

export function getReportYears(): Array<string> {
	return years;
}
