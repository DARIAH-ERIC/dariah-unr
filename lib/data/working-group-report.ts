import type {
	Prisma,
	WorkingGroup,
	WorkingGroupEventRole,
	WorkingGroupReport,
} from "@prisma/client";

import { db } from "@/lib/db";

interface CreateReportForWorkingGroupIdParams {
	facultativeQuestionsList: Prisma.InputJsonValue;
	narrativeQuestionsList: Prisma.InputJsonValue;
	workingGroupId: WorkingGroup["id"];
	reportCampaignId: string;
}

export function createReportForWorkingGroupId(params: CreateReportForWorkingGroupIdParams) {
	const { facultativeQuestionsList, narrativeQuestionsList, workingGroupId, reportCampaignId } =
		params;

	return db.workingGroupReport.upsert({
		create: {
			facultativeQuestionsList,
			narrativeQuestionsList,
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
		update: {
			facultativeQuestionsList,
			narrativeQuestionsList,
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
		where: {
			reportCampaignId_workingGroupId: {
				reportCampaignId,
				workingGroupId,
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
		include: {
			workingGroupEvents: true,
		},
	});
}

interface UpdateWorkingGroupReportParams {
	facultativeQuestionsList: Prisma.InputJsonValue;
	narrativeQuestionsList: Prisma.InputJsonValue;
	workingGroupReportId: string;
	comments: string | undefined;
	members: number;
	workingGroupEvents: Array<{
		id?: string;
		title: string;
		url: string;
		date: Date;
		role: WorkingGroupEventRole;
	}>;
}

export function updateWorkingGroupReport(params: UpdateWorkingGroupReportParams) {
	const {
		comments,
		facultativeQuestionsList,
		members,
		workingGroupEvents,
		narrativeQuestionsList,
		workingGroupReportId,
	} = params;

	return db.workingGroupReport.update({
		where: {
			id: workingGroupReportId,
		},
		data: {
			facultativeQuestionsList,
			narrativeQuestionsList,
			members,
			comments: { comments },
			workingGroupEvents: {
				deleteMany: {
					id: {
						notIn: workingGroupEvents
							.filter((event) => {
								return event.id;
							})
							.map((event) => {
								return event.id!;
							}),
					},
				},

				update: workingGroupEvents
					.filter((event) => {
						return event.id;
					})
					.map((event) => {
						return {
							where: { id: event.id },
							data: event,
						};
					}),
				create: workingGroupEvents.filter((event) => {
					return !event.id;
				}),
			},
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
