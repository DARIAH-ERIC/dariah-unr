import { z } from "zod";

export const dashboardCountryPageNCSections = [
	"index",
	"national-consortium",
	"contributions",
	"institutions",
	"reports",
] as const;

export const dashboardCountryPageSections = ["index", "reports"] as const;

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

export const dashboardAdminStatisticsPageParams = z.object({
	year: z.coerce.number().int().positive().min(2020),
});

export type DashboardAdminStatisticsPageParams = z.infer<typeof dashboardAdminStatisticsPageParams>;
