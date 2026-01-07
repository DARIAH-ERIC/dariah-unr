/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetProjectsParams {
	limit: number;
	offset: number;
}

export async function getProjects(params: GetProjectsParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.projects.findMany({
		columns: {
			id: true,
			name: true,
			scope: true,
			startDate: true,
			projectMonths: true,
			funders: true,
			amount: true,
			totalAmount: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}

interface GetProjectByIdParams {
	id: string;
}

export async function getProjectById(params: GetProjectByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.projects.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			scope: true,
			startDate: true,
			projectMonths: true,
			funders: true,
			amount: true,
			totalAmount: true,
		},
	});
}
