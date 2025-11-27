import type { EventSize, OutreachType, RoleType, ServiceSize } from "@prisma/client";

import { db } from "@/lib/db";

interface CreateReportCampaignParams {
	serviceSizeThresholds: Record<string, number>;
	year: number;
}

export function createReportCampaign(params: CreateReportCampaignParams) {
	const { serviceSizeThresholds, year } = params;

	return db.reportCampaign.create({
		data: {
			serviceSizeThresholds,
			year,
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

	return db.eventSizeValue.create({
		data: {
			annualValue,
			reportCampaignId,
			type,
		},
	});
}

interface CreateOutreachTypeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: OutreachType;
}

export function createOutreachTypeValue(params: CreateOutreachTypeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.outreachTypeValue.create({
		data: {
			annualValue,
			reportCampaignId,
			type,
		},
	});
}

interface CreateRoleTypeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: RoleType;
}

export function createRoleTypeValue(params: CreateRoleTypeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.roleTypeValue.create({
		data: {
			annualValue,
			reportCampaignId,
			type,
		},
	});
}

interface CreateServiceSizeValuesParams {
	annualValue: number;
	reportCampaignId: string;
	type: ServiceSize;
}

export function createServiceSizeValue(params: CreateServiceSizeValuesParams) {
	const { annualValue, reportCampaignId, type } = params;

	return db.serviceSizeValue.create({
		data: {
			annualValue,
			reportCampaignId,
			type,
		},
	});
}
