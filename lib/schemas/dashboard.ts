import { z } from "zod";

export const dashboardCountryReportPageParams = z.object({
	code: z.string(),
	year: z.coerce.number().int().positive().min(2020),
});

export type DashboardCountryReportPageParams = z.infer<typeof dashboardCountryReportPageParams>;

export const dashboardCountryReportEditPageParams = z.object({
	code: z.string(),
	year: z.coerce.number().int().positive().min(2020),
});

export type DashboardCountryReportEditPageParams = z.infer<
	typeof dashboardCountryReportEditPageParams
>;

export const dashboardCountryReportSteps = [
	"confirm",
	"contributions",
	"events",
	"institutions",
	"outreach",
	"project-funding-leverage",
	"publications",
	// "research-policy-developments",
	"services",
	"software",
	"summary",
	"welcome",
] as const;

export const dashboardCountryReportEditStepPageParams = z.object({
	code: z.string(),
	year: z.coerce.number().int().positive().min(2020),
	step: z.enum(dashboardCountryReportSteps),
});

export type DashboardCountryReportEditStepPageParams = z.infer<
	typeof dashboardCountryReportEditStepPageParams
>;

export const dashboardAdminStatisticsPageParams = z.object({
	year: z.coerce.number().int().positive().min(2020),
});

export type DashboardAdminStatisticsPageParams = z.infer<typeof dashboardAdminStatisticsPageParams>;
