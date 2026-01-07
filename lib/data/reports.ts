/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetReportsParams {
	limit: number;
	offset: number;
}

export async function getReports(params: GetReportsParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.reports.findMany({
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			contributionsCount: true,
			operationalCost: true,
			operationalCostDetail: true,
			operationalCostThreshold: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}

interface GetReportByIdParams {
	id: string;
}

export async function getReportById(params: GetReportByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.reports.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			contributionsCount: true,
			operationalCost: true,
			operationalCostDetail: true,
			operationalCostThreshold: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
	});
}

interface GetReportsByCountryCodeParams {
	code: string;
	limit: number;
	offset: number;
}

export async function getReportsByCountryCode(params: GetReportsByCountryCodeParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { code, limit, offset } = params;

	return db.query.reports.findMany({
		where: {
			country: {
				code,
			},
		},
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			contributionsCount: true,
			operationalCost: true,
			operationalCostDetail: true,
			operationalCostThreshold: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}

interface GetReportByCountryCodeAndYearParams {
	code: string;
	year: number;
}

export async function getReportByCountryCodeAndYear(params: GetReportByCountryCodeAndYearParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { code, year } = params;

	return db.query.reports.findFirst({
		where: {
			country: {
				code,
			},
			year,
		},
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			contributionsCount: true,
			operationalCost: true,
			operationalCostDetail: true,
			operationalCostThreshold: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
	});
}
