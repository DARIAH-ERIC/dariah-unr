import { db } from "@/lib/db";

interface GetReportByCountryCodeAndYearParams {
	code: string;
	year: number;
}

export function getReportByCountryCodeAndYear(params: GetReportByCountryCodeAndYearParams) {
	const { code, year } = params;

	return db.report.findFirst({
		where: {
			country: {
				code,
			},
			year,
		},
		// TODO: pass as param
		include: {
			country: true,
			eventReport: true,
			outreachReports: true,
			projectsFundingLeverages: true,
			researchPolicyDevelopments: true,
			serviceReports: true,
		},
	});
}
