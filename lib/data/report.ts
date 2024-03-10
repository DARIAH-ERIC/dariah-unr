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

interface GetReportByCountryCodeParams {
	countryCode: Country["code"];
	year: Report["year"];
}

export function getReportByCountryCode(params: GetReportByCountryCodeParams) {
	const { countryCode, year } = params;

	return db.report.findFirst({
		where: {
			country: {
				code: countryCode,
			},
			year,
		},
	});
}

interface CreateReportForCountryIdParams {
	countryId: Country["id"];
	year: Report["year"];
}

export function getReportByCountryId(params: CreateReportForCountryIdParams) {
	const { countryId, year } = params;

	return db.report.findFirst({
		where: {
			country: {
				id: countryId,
			},
			year,
		},
	});
}

interface CreateReportForCountryIdParams {
	countryId: Country["id"];
	year: Report["year"];
}

export function createReportForCountryId(params: CreateReportForCountryIdParams) {
	const { countryId, year } = params;

	return db.report.create({
		data: {
			country: {
				connect: {
					id: countryId,
				},
			},
			year,
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
		include: {
			kpis: true,
			outreach: true,
		},
	});
}

interface GetProjectsFundingLeveragesParams {
	reportId: Report["id"];
}

export function getProjectsFundingLeverages(params: GetProjectsFundingLeveragesParams) {
	const { reportId } = params;

	return db.projectsFundingLeverage.findMany({
		where: {
			report: {
				id: reportId,
			},
		},
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
		include: {
			kpis: true,
			service: true,
		},
	});
}

interface UpsertEventReportParams {
	attendees?: EventReport["attendees"];
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
	reportId: Report["id"];
}

export function getReportComments(params: GetReportCommentsParams) {
	const { reportId } = params;

	return db.report.findUnique({
		where: {
			id: reportId,
		},
		select: {
			comments: true,
		},
	});
}

interface UpdateReportCommentsParams {
	comments: Prisma.ReportUpdateInput["comments"];
	reportId: Report["id"];
}

export function updateReportComments(params: UpdateReportCommentsParams) {
	const { comments, reportId } = params;

	return db.report.update({
		where: {
			id: reportId,
		},
		data: {
			comments,
		},
	});
}