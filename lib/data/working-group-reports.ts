/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetWorkingGroupReportsParams {
	limit: number;
	offset: number;
}

export async function getWorkingGroupReports(params: GetWorkingGroupReportsParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.workingGroupReports.findMany({
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			members: true,
			facultativeQuestions: true,
			narrativeReport: true,
		},
		with: {
			workingGroup: {
				columns: {
					id: true,
					slug: true,
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

interface GetWorkingGroupReportByIdParams {
	id: string;
}

export async function getWorkingGroupReportById(params: GetWorkingGroupReportByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.workingGroupReports.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			members: true,
			facultativeQuestions: true,
			narrativeReport: true,
		},
		with: {
			workingGroup: {
				columns: {
					id: true,
					slug: true,
					name: true,
				},
			},
		},
	});
}

interface GetWorkingGroupReportsByWorkingGroupSlugParams {
	limit: number;
	offset: number;
	slug: string;
}

export async function getWorkingGroupReportsByWorkingGroupSlug(
	params: GetWorkingGroupReportsByWorkingGroupSlugParams,
) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset, slug } = params;

	return db.query.workingGroupReports.findMany({
		where: {
			workingGroup: {
				slug,
			},
		},
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			members: true,
			facultativeQuestions: true,
			narrativeReport: true,
		},
		with: {
			workingGroup: {
				columns: {
					id: true,
					slug: true,
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

interface GetWorkingGroupReportByWorkingGroupSlugAndYearParams {
	slug: string;
	year: number;
}

export async function getWorkingGroupReportByWorkingGroupSlugAndYear(
	params: GetWorkingGroupReportByWorkingGroupSlugAndYearParams,
) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { slug, year } = params;

	return db.query.workingGroupReports.findFirst({
		where: {
			workingGroup: {
				slug,
			},
			year,
		},
		columns: {
			id: true,
			year: true,
			status: true,
			comments: true,
			members: true,
			facultativeQuestions: true,
			narrativeReport: true,
		},
		with: {
			workingGroup: {
				columns: {
					id: true,
					slug: true,
					name: true,
				},
			},
		},
	});
}
