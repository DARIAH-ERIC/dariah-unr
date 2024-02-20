import type { Report } from "@prisma/client";
import type { ReactNode } from "react";

import { ProjectsFundingLeveragesFormContent } from "@/components/forms/projects-funding-leverages-form-content";
import { getProjectsFundingLeverages } from "@/lib/data/report";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ProjectsFundingLeveragesFormProps {
	comments: ReportCommentsSchema | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

// @ts-expect-error Upstream type issue.
export async function ProjectsFundingLeveragesForm(
	props: ProjectsFundingLeveragesFormProps,
): Promise<ReactNode> {
	const { comments, previousReportId, reportId } = props;

	const projectsFundingLeverages = await getProjectsFundingLeverages({ reportId });
	const previousProjectsFundingLeverages =
		previousReportId != null ? await getProjectsFundingLeverages({ reportId }) : null;

	return (
		<ProjectsFundingLeveragesFormContent
			comments={comments}
			previousProjectsFundingLeverages={previousProjectsFundingLeverages}
			previousReportId={previousReportId}
			projectsFundingLeverages={projectsFundingLeverages}
			reportId={reportId}
		/>
	);
}
