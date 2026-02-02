import type { EventSize, OutreachType, Prisma, RoleType, ServiceSize } from "@prisma/client";

import { db } from "@/lib/db";

interface CreateReportCampaignParams {
	facultativeQuestionsListTemplate?: Prisma.InputJsonValue;
	narrativeQuestionsListTemplate?: Prisma.InputJsonValue;
	serviceSizeThresholds: Record<string, number>;
	year: number;
}

export function createReportCampaign(params: CreateReportCampaignParams) {
	const {
		facultativeQuestionsListTemplate,
		narrativeQuestionsListTemplate,
		serviceSizeThresholds,
		year,
	} = params;

	return db.reportCampaign.upsert({
		create: {
			facultativeQuestionsListTemplate,
			narrativeQuestionsListTemplate,
			serviceSizeThresholds,
			year,
		},
		update: {
			facultativeQuestionsListTemplate,
			narrativeQuestionsListTemplate,
			serviceSizeThresholds,
			year,
		},
		where: {
			year,
		},
	});
}

interface GetReportCampaignByIdParams {
	id: string;
}

export function getReportCampaignById(params: GetReportCampaignByIdParams) {
	const { id } = params;

	return db.reportCampaign.findFirst({
		where: { id },
	});
}

interface GetReportCampaignByYearParams {
	year: number;
}

export function getReportCampaignByYear(params: GetReportCampaignByYearParams) {
	const { year } = params;

	return db.reportCampaign.findFirst({
		where: { year },
	});
}

interface GetReportCampaignForReportIdParams {
	reportId: string;
}

export function getReportCampaignForReportId(params: GetReportCampaignForReportIdParams) {
	const { reportId } = params;

	return db.reportCampaign.findFirst({
		where: {
			reports: {
				some: {
					id: reportId,
				},
			},
		},
	});
}

interface GetReportCampaignForWorkingGroupReportIdParams {
	workingGroupReportId: string;
}

export function getReportCampaignForWorkingGroupReportId(
	params: GetReportCampaignForWorkingGroupReportIdParams,
) {
	const { workingGroupReportId } = params;

	return db.reportCampaign.findFirst({
		where: {
			workingGroupReports: {
				some: {
					id: workingGroupReportId,
				},
			},
		},
	});
}

interface CreateEventSizeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: EventSize;
}

export function createEventSizeValue(params: CreateEventSizeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.eventSizeValue.upsert({
		create: {
			annualValue,
			reportCampaignId,
			type,
		},
		update: {
			annualValue,
			reportCampaignId,
			type,
		},
		where: {
			reportCampaignId_type: {
				reportCampaignId,
				type,
			},
		},
	});
}

interface GetEventSizeValuesParams {
	reportCampaignId: string;
}

export function getEventSizeValues(params: GetEventSizeValuesParams) {
	const { reportCampaignId } = params;

	return db.eventSizeValue.findMany({
		where: { reportCampaignId },
	});
}

interface CreateOutreachTypeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: OutreachType;
}

export function createOutreachTypeValue(params: CreateOutreachTypeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.outreachTypeValue.upsert({
		create: {
			annualValue,
			reportCampaignId,
			type,
		},
		update: {
			annualValue,
			reportCampaignId,
			type,
		},
		where: {
			reportCampaignId_type: {
				reportCampaignId,
				type,
			},
		},
	});
}

interface GetOutreachTypeValuesParams {
	reportCampaignId: string;
}

export function getOutreachTypeValues(params: GetOutreachTypeValuesParams) {
	const { reportCampaignId } = params;

	return db.outreachTypeValue.findMany({
		where: { reportCampaignId },
	});
}

interface CreateRoleTypeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: RoleType;
}

export function createRoleTypeValue(params: CreateRoleTypeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.roleTypeValue.upsert({
		create: {
			annualValue,
			reportCampaignId,
			type,
		},
		update: {
			annualValue,
			reportCampaignId,
			type,
		},
		where: {
			reportCampaignId_type: {
				reportCampaignId,
				type,
			},
		},
	});
}

interface GetRoleTypeValuesParams {
	reportCampaignId: string;
}

export function getRoleTypeValues(params: GetRoleTypeValuesParams) {
	const { reportCampaignId } = params;

	return db.roleTypeValue.findMany({
		where: { reportCampaignId },
	});
}

interface CreateServiceSizeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: ServiceSize;
}

export function createServiceSizeValue(params: CreateServiceSizeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.serviceSizeValue.upsert({
		create: {
			annualValue,
			reportCampaignId,
			type,
		},
		update: {
			annualValue,
			reportCampaignId,
			type,
		},
		where: {
			reportCampaignId_type: {
				reportCampaignId,
				type,
			},
		},
	});
}

interface GetServiceSizeValuesParams {
	reportCampaignId: string;
}

export function getServiceSizeValues(params: GetServiceSizeValuesParams) {
	const { reportCampaignId } = params;

	return db.serviceSizeValue.findMany({
		where: { reportCampaignId },
	});
}
