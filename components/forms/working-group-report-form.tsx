import type { WorkingGroup, WorkingGroupReport } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { WorkingGroupReportFormContent } from "@/components/forms/working-group-report-form-content";

interface WorkingGroupReportFormParams {
	isConfirmationAvailable: boolean;
	previousWorkingGroupReport?: WorkingGroupReport | null;
	workingGroup: WorkingGroup;
	workingGroupReport: WorkingGroupReport;
}

export function WorkingGroupReportForm(params: WorkingGroupReportFormParams): ReactNode {
	const {
		isConfirmationAvailable,
		previousWorkingGroupReport: _previousWorkingGroupReport,
		workingGroup,
		workingGroupReport,
	} = params;

	const t = useTranslations("WorkingGroupReportForm");

	return (
		<div>
			<h2>{t("title")}</h2>
			<WorkingGroupReportFormContent
				confirmationInfo={t("confirmation-info")}
				confirmationLabel={t("confirm")}
				isConfirmationAvailable={isConfirmationAvailable}
				// previousWorkingGroupReport={previousWorkingGroupReport}
				submitLabel={t("submit")}
				workingGroup={workingGroup}
				workingGroupReport={workingGroupReport}
			/>
		</div>
	);
}
