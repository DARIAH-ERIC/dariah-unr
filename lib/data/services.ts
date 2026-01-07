/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetServicesParams {
	limit: number;
	offset: number;
}

export async function getServices(params: GetServicesParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.services.findMany({
		columns: {
			id: true,
			name: true,
			type: true,
			status: true,
			url: true,
			technicalContact: true,
			technicalReadinessLevel: true,
			privateSupplier: true,
			valueProposition: true,
			agreements: true,
			audience: true,
			dariahBranding: true,
			eoscOnboarding: true,
			marketplaceStatus: true,
			marketplaceId: true,
			monitoring: true,
			comment: true,
		},
		with: {
			countries: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
			serviceSize: {
				columns: {
					id: true,
					type: true,
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

interface GetServiceByIdParams {
	id: string;
}

export async function getServiceById(params: GetServiceByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.services.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			type: true,
			status: true,
			url: true,
			technicalContact: true,
			technicalReadinessLevel: true,
			privateSupplier: true,
			valueProposition: true,
			agreements: true,
			audience: true,
			dariahBranding: true,
			eoscOnboarding: true,
			marketplaceStatus: true,
			marketplaceId: true,
			monitoring: true,
			comment: true,
		},
		with: {
			countries: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
			serviceSize: {
				columns: {
					id: true,
					type: true,
				},
			},
		},
	});
}
