import type { ProjectScope, ProjectsFundingLeverage } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { db } from "@/lib/db";

export function getProjectsFundingLeverages() {
	return db.projectsFundingLeverage.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			report: {
				select: {
					id: true,
				},
			},
		},
	});
}

interface UpdateProjectFundingLeverageParams {
	id: string;
	name?: ProjectsFundingLeverage["name"];
	amount?: number;
	funders?: string;
	projectMonths?: number;
	scope?: ProjectScope;
	totalAmount?: number;
	startDate?: ProjectsFundingLeverage["startDate"];
}

export function updateProjectFundingLeverage(params: UpdateProjectFundingLeverageParams) {
	const { id, name, amount, funders, projectMonths, scope, startDate, totalAmount } = params;

	return db.projectsFundingLeverage.update({
		where: {
			id,
		},
		data: {
			name,
			amount: new Decimal(amount ?? 0),
			funders,
			projectMonths,
			scope,
			startDate,
			totalAmount: new Decimal(totalAmount ?? 0),
		},
	});
}

interface DeleteProjectFundingLeverageParams {
	id: string;
}

export function deleteProjectFundingLeverage(params: DeleteProjectFundingLeverageParams) {
	const { id } = params;

	return db.projectsFundingLeverage.delete({
		where: {
			id,
		},
	});
}
