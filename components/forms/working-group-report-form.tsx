import type { WorkingGroupReport } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { WorkingGroupReportFormContent } from "@/components/forms/working-group-report-form-content";

interface WorkingGroupReportFormParams {
	workingGroupReport: WorkingGroupReport;
}

export function WorkingGroupReportForm(params: WorkingGroupReportFormParams): ReactNode {
	const { workingGroupReport } = params;

	const t = useTranslations("WorkingGroupReportForm");

	return (
		<div>
			<h2>{t("title")}</h2>
			<WorkingGroupReportFormContent
				submitLabel={"submit"}
				workingGroupReport={workingGroupReport}
			/>
		</div>
	);
}
