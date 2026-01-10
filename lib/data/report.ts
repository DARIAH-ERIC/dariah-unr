import type {
	Country,
	EventReport,
	Outreach,
	OutreachKpi,
	OutreachReport,
	Prisma,
	ProjectsFundingLeverage,
	Report,
	Service,
	ServiceKpi,
	ServiceReport,
} from "@prisma/client";

import { db } from "@/lib/db";

interface GetOperationalCostThresholdsForReportCampaignParams {
	reportCampaignId: string;
}

export function getOperationalCostThresholdsForReportCampaign(
	params: GetOperationalCostThresholdsForReportCampaignParams,
) {
	const { reportCampaignId } = params;

	return db.report.findMany({
		where: {
			reportCampaignId,
		},
		select: {
			countryId: true,
			operationalCostThreshold: true,
		},
	});
}

export function getReports() {
	return db.report.findMany({
		orderBy: {
			reportCampaign: {
				year: "desc",
			},
		},
		include: {
			country: {
				select: { id: true },
			},
			reportCampaign: {
				select: {
					year: true,
				},
			},
		},
	});
}

interface GetReportByIdParams {
	id: Report["id"];
}

export async function getReportById(params: GetReportByIdParams) {
	const { id } = params;

	const report = await db.report.findFirst({
		where: {
			id,
		},
		include: {
			eventReport: true,
		},
	});

	if (!report) return;

	return {
		...report,
		operationalCostThreshold: report.operationalCostThreshold?.toNumber(),
	};
}

interface GetReportYearsByCountryCodeParams {
	countryCode: Country["code"];
}

export function getReportYearsByCountryCode(params: GetReportYearsByCountryCodeParams) {
	const { countryCode } = params;

	return db.report.findMany({
		where: {
			country: {
				code: countryCode,
			},
		},
		select: { year: true },
	});
}

interface GetReportByCountryCodeParams {
	countryCode: Country["code"];
	reportCampaignId: string;
}

export function getReportByCountryCode(params: GetReportByCountryCodeParams) {
	const { countryCode, reportCampaignId } = params;

	return db.report.findFirst({
		where: {
			country: {
				code: countryCode,
			},
			reportCampaignId,
		},
	});
}

interface GetReportByCountryIdParams {
	countryId: Country["id"];
	reportCampaignId: string;
}

export function getReportByCountryId(params: GetReportByCountryIdParams) {
	const { countryId, reportCampaignId } = params;

	return db.report.findFirst({
		where: {
			countryId,
			reportCampaignId,
		},
	});
}

interface CreateReportForCountryIdParams {
	countryId: Country["id"];
	operationalCostThreshold: number;
	reportCampaignId: string;
}

export function createReportForCountryId(params: CreateReportForCountryIdParams) {
	const { countryId, operationalCostThreshold, reportCampaignId } = params;

	return db.report.create({
		data: {
			country: {
				connect: {
					id: countryId,
				},
			},
			operationalCostThreshold,
			reportCampaign: {
				connect: {
					id: reportCampaignId,
				},
			},
		},
	});
}

interface UpdateReportStatusParams {
	id: Report["id"];
}

export function updateReportStatus(params: UpdateReportStatusParams) {
	const { id } = params;

	return db.report.update({
		where: {
			id,
		},
		data: {
			status: "final",
		},
		select: {
			country: {
				select: {
					name: true,
				},
			},
			reportCampaign: {
				select: {
					year: true,
				},
			},
		},
	});
}

interface GetEventReportParams {
	reportId: Report["id"];
}

export function getEventReport(params: GetEventReportParams) {
	const { reportId } = params;

	return db.eventReport.findFirst({
		where: {
			report: {
				id: reportId,
			},
		},
	});
}

interface GetOutreachReportsParams {
	reportId: Report["id"];
}

export function getOutreachReports(params: GetOutreachReportsParams) {
	const { reportId } = params;

	return db.outreachReport.findMany({
		where: {
			report: {
				id: reportId,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
		include: {
			kpis: true,
			outreach: true,
		},
	});
}

interface GetProjectsFundingLeveragesParams {
	reportId: Report["id"];
}

export async function getProjectsFundingLeverages(params: GetProjectsFundingLeveragesParams) {
	const { reportId } = params;

	const projectFundingLeverages = await db.projectsFundingLeverage.findMany({
		where: {
			report: {
				id: reportId,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	return projectFundingLeverages.map((projectFundingLeverage) => {
		return {
			...projectFundingLeverage,
			amount: projectFundingLeverage.amount?.toNumber(),
		};
	});
}

interface GetResearchPolicyDevelopmentsParams {
	reportId: Report["id"];
}

export function getResearchPolicyDevelopments(params: GetResearchPolicyDevelopmentsParams) {
	const { reportId } = params;

	return db.researchPolicyDevelopment.findMany({
		where: {
			report: {
				id: reportId,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	});
}

interface GetServiceReportsParams {
	reportId: Report["id"];
}

export function getServiceReports(params: GetServiceReportsParams) {
	const { reportId } = params;

	return db.serviceReport.findMany({
		where: {
			report: {
				id: reportId,
			},
			service: {
				status: "live",
			},
		},
		orderBy: {
			createdAt: "asc",
		},
		include: {
			kpis: true,
			service: true,
		},
	});
}

interface UpsertEventReportParams {
	dariahCommissionedEvent?: EventReport["dariahCommissionedEvent"];
	eventReportId: EventReport["id"] | undefined;
	largeMeetings?: EventReport["largeMeetings"];
	mediumMeetings?: EventReport["mediumMeetings"];
	reportId: Report["id"];
	reusableOutcomes?: EventReport["reusableOutcomes"];
	smallMeetings?: EventReport["smallMeetings"];
}

export function upsertEventReport(params: UpsertEventReportParams) {
	const { eventReportId, reportId, ...data } = params;

	if (eventReportId == null) {
		return db.eventReport.create({
			data: {
				...data,
				report: {
					connect: {
						id: reportId,
					},
				},
			},
		});
	}

	return db.eventReport.update({
		where: {
			id: eventReportId,
		},
		data: {
			...data,
			report: {
				connect: {
					id: reportId,
				},
			},
		},
	});
}

interface CreateOutreachReportParams {
	outreachId: Outreach["id"];
	reportId: Report["id"];
}

export function createOutreachReport(params: CreateOutreachReportParams) {
	const { outreachId, reportId } = params;

	return db.outreachReport.create({
		data: {
			outreach: {
				connect: {
					id: outreachId,
				},
			},
			report: {
				connect: {
					id: reportId,
				},
			},
		},
	});
}

interface UpsertOutreachKpiParams {
	outreachReportId: OutreachReport["id"];
	id?: OutreachKpi["id"];
	unit: OutreachKpi["unit"];
	value: OutreachKpi["value"];
}

export function upsertOutreachKpi(params: UpsertOutreachKpiParams) {
	const { id, unit, value, outreachReportId } = params;

	if (id == null) {
		return db.outreachKpi.create({
			data: {
				outreachReport: {
					connect: {
						id: outreachReportId,
					},
				},
				unit,
				value,
			},
		});
	}

	return db.outreachKpi.update({
		where: {
			id,
		},
		data: {
			outreachReport: {
				connect: {
					id: outreachReportId,
				},
			},
			unit,
			value,
		},
	});
}

interface CreateServiceReportParams {
	serviceId: Service["id"];
	reportId: Report["id"];
}

export function createServiceReport(params: CreateServiceReportParams) {
	const { serviceId, reportId } = params;

	return db.serviceReport.create({
		data: {
			service: {
				connect: {
					id: serviceId,
				},
			},
			report: {
				connect: {
					id: reportId,
				},
			},
		},
	});
}

interface UpsertServiceKpiParams {
	serviceReportId: ServiceReport["id"];
	id?: ServiceKpi["id"];
	unit: ServiceKpi["unit"];
	value: ServiceKpi["value"];
}

export function upsertServiceKpi(params: UpsertServiceKpiParams) {
	const { id, unit, value, serviceReportId } = params;

	if (id == null) {
		return db.serviceKpi.create({
			data: {
				serviceReport: {
					connect: {
						id: serviceReportId,
					},
				},
				unit,
				value,
			},
		});
	}

	return db.serviceKpi.update({
		where: {
			id,
		},
		data: {
			serviceReport: {
				connect: {
					id: serviceReportId,
				},
			},
			unit,
			value,
		},
	});
}

// TODO: use Prisma.ProjectsFundingLeverageCreateInput
interface CreateProjectFundingLeverageParams {
	amount: ProjectsFundingLeverage["amount"];
	funders: ProjectsFundingLeverage["funders"];
	name: ProjectsFundingLeverage["name"];
	projectMonths: ProjectsFundingLeverage["projectMonths"];
	reportId: Report["id"];
	scope: ProjectsFundingLeverage["scope"];
	startDate: ProjectsFundingLeverage["startDate"];
}

export function createProjectFundingLeverage(params: CreateProjectFundingLeverageParams) {
	const { reportId, ...data } = params;

	return db.projectsFundingLeverage.create({
		data: {
			...data,
			report: {
				connect: {
					id: reportId,
				},
			},
		},
	});
}

interface GetReportCommentsParams {
	id: Report["id"];
}

export function getReportComments(params: GetReportCommentsParams) {
	const { id } = params;

	return db.report.findUnique({
		where: {
			id,
		},
		select: {
			comments: true,
		},
	});
}

interface UpdateReportCommentsParams {
	comments: Prisma.ReportUpdateInput["comments"];
	id: Report["id"];
}

export function updateReportComments(params: UpdateReportCommentsParams) {
	const { comments, id } = params;

	return db.report.update({
		where: {
			id,
		},
		data: {
			comments,
		},
		include: {
			country: {
				select: {
					name: true,
				},
			},
			reportCampaign: {
				select: {
					year: true,
				},
			},
		},
	});
}

interface UpdateReportContributionsCountParams {
	contributionsCount: Report["contributionsCount"];
	id: Report["id"];
}

export function updateReportContributionsCount(params: UpdateReportContributionsCountParams) {
	const { contributionsCount, id } = params;

	return db.report.update({
		where: {
			id,
		},
		data: {
			contributionsCount,
		},
	});
}

interface UpdateReportCalculationParams {
	id: Report["id"];
	operationalCost: Report["operationalCost"];
	operationalCostDetail: Prisma.ReportUpdateInput["operationalCostDetail"];
}

export function updateReportCalculation(params: UpdateReportCalculationParams) {
	const { id, operationalCost, operationalCostDetail } = params;

	return db.report.update({
		where: {
			id,
		},
		data: {
			operationalCost,
			operationalCostDetail,
		},
	});
}

interface GetReportStatusByCountryCodeParams {
	countryCode: Country["code"];
	reportCampaignId: string;
}

export function getReportStatusByCountryCode(params: GetReportStatusByCountryCodeParams) {
	const { countryCode, reportCampaignId } = params;

	return db.report.findFirst({
		where: {
			country: {
				code: countryCode,
			},
			reportCampaignId,
		},
		select: {
			status: true,
		},
	});
}
