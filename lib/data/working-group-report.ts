import type { WorkingGroup, WorkingGroupReport } from "@prisma/client";

import { db } from "@/lib/db";

interface CreateReportForWorkingGroupIdParams {
	facultativeQuestions: WorkingGroupReport["facultativeQuestions"];
	narrativeReport: WorkingGroupReport["narrativeReport"];
	workingGroupId: WorkingGroup["id"];
	reportCampaignId: string;
}

export function createReportForWorkingGroupId(params: CreateReportForWorkingGroupIdParams) {
	const { facultativeQuestions, narrativeReport, workingGroupId, reportCampaignId } = params;

	return db.workingGroupReport.create({
		data: {
			facultativeQuestions,
			narrativeReport,
			reportCampaign: {
				connect: {
					id: reportCampaignId,
				},
			},
			workingGroup: {
				connect: {
					id: workingGroupId,
				},
			},
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
			workingGroup: {
				id: workingGroupId,
			},
		},
		select: {
			id: true,
			status: true,
			reportCampaign: {
				select: {
					year: true,
				},
			},
		},
		orderBy: {
			reportCampaign: {
				year: "desc",
			},
		},
	});
}

interface GetWorkingGroupReportsByWorkingGroupSlugParams {
	workingGroupSlug: string;
}

export function getWorkingGroupReportsByWorkingGroupSlug(
	params: GetWorkingGroupReportsByWorkingGroupSlugParams,
) {
	const { workingGroupSlug } = params;

	return db.workingGroupReport.findMany({
		where: {
			workingGroup: {
				slug: workingGroupSlug,
			},
		},
		select: {
			reportCampaign: {
				select: {
					year: true,
				},
			},
		},
		orderBy: {
			reportCampaign: {
				year: "desc",
			},
		},
	});
}

interface GetWorkingGroupReportParams {
	workingGroupId: string;
	reportCampaignId: string;
}

export function getWorkingGroupReport(params: GetWorkingGroupReportParams) {
	const { workingGroupId, reportCampaignId } = params;

	return db.workingGroupReport.findFirst({
		where: {
			workingGroupId,
			reportCampaignId,
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

interface UpdateWorkingGroupReportStatusParams {
	id: WorkingGroupReport["id"];
}

export function updateWorkingGroupReportStatus(params: UpdateWorkingGroupReportStatusParams) {
	const { id } = params;

	return db.workingGroupReport.update({
		where: {
			id,
		},
		data: {
			status: "final",
		},
		select: {
			workingGroup: {
				select: {
					name: true,
				},
			},
			reportCampaign: {
				select: {
					year: true,
				},
			},
		},
	});
}
