/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetWorkingGroupsParams {
	limit: number;
	offset: number;
}

export async function getWorkingGroups(params: GetWorkingGroupsParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.workingGroups.findMany({
		columns: {
			id: true,
			slug: true,
			name: true,
			startDate: true,
			endDate: true,
			contactEmail: true,
			mailingList: true,
			memberTracking: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}

interface GetWorkingGroupByIdParams {
	id: string;
}

export async function getWorkingGroupById(params: GetWorkingGroupByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.workingGroups.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			slug: true,
			name: true,
			startDate: true,
			endDate: true,
			contactEmail: true,
			mailingList: true,
			memberTracking: true,
		},
	});
}

interface GetWorkingGroupBySlugParams {
	slug: string;
}

export async function getWorkingGroupBySlug(params: GetWorkingGroupBySlugParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { slug } = params;

	return db.query.workingGroups.findFirst({
		where: {
			slug,
		},
		columns: {
			id: true,
			slug: true,
			name: true,
			startDate: true,
			endDate: true,
			contactEmail: true,
			mailingList: true,
			memberTracking: true,
		},
	});
}
