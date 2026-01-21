import type { Prisma, WorkingGroup, WorkingGroupReport } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { WorkingGroupReportFormContent } from "@/components/forms/working-group-report-form-content";
import { getWorkingGroupPublications } from "@/lib/zotero";

interface WorkingGroupReportFormParams {
	isConfirmationAvailable: boolean;
	previousWorkingGroupReport?: WorkingGroupReport | null;
	workingGroup: WorkingGroup;
	workingGroupReport: Prisma.WorkingGroupReportGetPayload<{
		include: { workingGroupEvents: true };
	}>;
	year: number;
}

export async function WorkingGroupReportForm(
	params: WorkingGroupReportFormParams,
): Promise<ReactNode> {
	const {
		isConfirmationAvailable,
		previousWorkingGroupReport: _previousWorkingGroupReport,
		workingGroup,
		workingGroupReport,
		year,
	} = params;

	const t = await getTranslations("WorkingGroupReportForm");

	const { bibliography, items } = await getWorkingGroupPublications({
		name: workingGroup.name,
		slug: workingGroup.slug,
		year,
	});

	return (
		<WorkingGroupReportFormContent
			bibliography={bibliography}
			confirmationInfo={t("confirmation-info")}
			confirmationLabel={t("confirm")}
			isConfirmationAvailable={isConfirmationAvailable}
			// previousWorkingGroupReport={previousWorkingGroupReport}
			submitLabel={t("submit")}
			total={items.length}
			workingGroup={workingGroup}
			workingGroupReport={workingGroupReport}
			year={year}
		/>
	);
}
