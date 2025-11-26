import type { WorkingGroup, WorkingGroupReport } from "@prisma/client";

import { db } from "@/lib/db";

interface CreateReportForWorkingGroupIdParams {
	facultativeQuestions: WorkingGroupReport["facultativeQuestions"];
	narrativeReport: WorkingGroupReport["narrativeReport"];
	workingGroupId: WorkingGroup["id"];
	year: WorkingGroupReport["year"];
}

export function createReportForWorkingGroupId(params: CreateReportForWorkingGroupIdParams) {
	const { facultativeQuestions, narrativeReport, workingGroupId, year } = params;

	return db.workingGroupReport.create({
		data: {
			facultativeQuestions,
			narrativeReport,
			workingGroup: {
				connect: {
					id: workingGroupId,
				},
			},
			year,
		},
	});
}
