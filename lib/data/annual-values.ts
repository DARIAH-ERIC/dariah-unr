import type { EventSizeType, OutreachType, RoleType, ServiceSizeType } from "@prisma/client";

import { db } from "@/lib/db";

// FIXME: These tables currently hold `annualValues` but are overwritten every year.
// FIXME: check if these already exist in lib/data/report.ts

interface GetEventSizeValuesParams {
	year: number;
}

export function getEventSizeValues(_params: GetEventSizeValuesParams) {
	// const { year } = params

	return db.eventSize.findMany({
		select: {
			annualValue: true,
			id: true,
			type: true,
		},
		orderBy: { type: "asc" },
	});
}

interface UpdateEventSizeValuesParams {
	annualValue: number;
	id: string;
}

export function updateEventSizeValue(params: UpdateEventSizeValuesParams) {
	const { annualValue, id } = params;

	return db.eventSize.update({
		where: {
			id,
		},
		data: {
			annualValue,
		},
	});
}

interface GetOutreachTypeValuesParams {
	year: number;
}

export function getOutreachTypeValues(_params: GetOutreachTypeValuesParams) {
	// const { year } = params

	return db.outreachTypeValue.findMany({
		select: {
			annualValue: true,
			id: true,
			type: true,
		},
		orderBy: { type: "asc" },
	});
}

interface UpdateOutreachTypeValuesParams {
	annualValue: number;
	id: string;
}

export function updateOutreachTypeValue(params: UpdateOutreachTypeValuesParams) {
	const { annualValue, id } = params;

	return db.outreachTypeValue.update({
		where: {
			id,
		},
		data: {
			annualValue,
		},
	});
}

interface GetRoleTypeValuesParams {
	year: number;
}

export function getRoleTypeValues(_params: GetRoleTypeValuesParams) {
	// const { year } = params

	return db.role.findMany({
		select: {
			annualValue: true,
			id: true,
			type: true,
		},
		orderBy: { type: "asc" },
	});
}

interface UpdateRoleTypeValuesParams {
	annualValue: number;
	id: string;
}

export function updateRoleTypeValue(params: UpdateRoleTypeValuesParams) {
	const { annualValue, id } = params;

	return db.role.update({
		where: {
			id,
		},
		data: {
			annualValue,
		},
	});
}

interface GetServiceSizeValuesParams {
	year: number;
}

export function getServiceSizeValues(_params: GetServiceSizeValuesParams) {
	// const { year } = params

	return db.serviceSize.findMany({
		select: {
			annualValue: true,
			id: true,
			type: true,
		},
		orderBy: { type: "asc" },
	});
}

interface UpdateServiceSizeValuesParams {
	annualValue: number;
	id: string;
}

export function updateServiceSizeValue(params: UpdateServiceSizeValuesParams) {
	const { annualValue, id } = params;

	return db.serviceSize.update({
		where: {
			id,
		},
		data: {
			annualValue,
		},
	});
}

// --- only used until we introduce ReportCampaign ---

interface GetEventSizeValueByTypeParams {
	type: EventSizeType;
}

export function getEventSizeValueByType(params: GetEventSizeValueByTypeParams) {
	const { type } = params;

	return db.eventSize.findFirst({
		where: {
			type,
		},
		select: {
			id: true,
		},
	});
}

interface GetOutreachTypeValueByTypeParams {
	type: OutreachType;
}

export function getOutreachTypeValueByType(params: GetOutreachTypeValueByTypeParams) {
	const { type } = params;

	return db.outreachTypeValue.findFirst({
		where: {
			type,
		},
		select: {
			id: true,
		},
	});
}

interface GetRoleTypeValueByTypeParams {
	type: RoleType;
}

export function getRoleTypeValueByType(params: GetRoleTypeValueByTypeParams) {
	const { type } = params;

	return db.role.findFirst({
		where: {
			type,
		},
		select: {
			id: true,
		},
	});
}

interface GetServiceSizeValueByTypeParams {
	type: ServiceSizeType;
}

export function getServiceSizeValueByType(params: GetServiceSizeValueByTypeParams) {
	const { type } = params;

	return db.serviceSize.findFirst({
		where: {
			type,
		},
		select: {
			id: true,
		},
	});
}
