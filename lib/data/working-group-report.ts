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

interface GetWorkingGroupReportsByWorkingGroupIdParams {
	workingGroupId: string;
}

export function getWorkingGroupReportsByWorkingGroupId(
	params: GetWorkingGroupReportsByWorkingGroupIdParams,
) {
	const { workingGroupId } = params;

	return db.workingGroupReport.findMany({
		where: {
			workingGroupId,
		},
	});
}

interface GetWorkingGroupReportParams {
	workingGroupId: string;
	year: number;
}

export function getWorkingGroupReport(params: GetWorkingGroupReportParams) {
	const { workingGroupId, year } = params;

	return db.workingGroupReport.findFirst({
		where: {
			workingGroupId,
			year,
		},
	});
}

interface UpdateWorkingGroupReportParams {
	facultativeQuestions: string;
	narrativeReport: string;
	workingGroupReportId: string;
}

export function updateWorkingGroupReport(params: UpdateWorkingGroupReportParams) {
	const { facultativeQuestions, narrativeReport, workingGroupReportId } = params;

	return db.workingGroupReport.update({
		where: {
			id: workingGroupReportId,
		},
		data: {
			facultativeQuestions,
			narrativeReport,
		},
	});
}
