import type { Report } from "@prisma/client";

import { ProjectsFundingLeveragesFormContent } from "@/components/forms/projects-funding-leverages-form-content";
import { getProjectsFundingLeverages } from "@/lib/data/report";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ProjectsFundingLeveragesFormProps {
	comments: ReportCommentsSchema | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export async function ProjectsFundingLeveragesForm(props: ProjectsFundingLeveragesFormProps) {
	const { comments, previousReportId, reportId } = props;

	const projectsFundingLeverages = await getProjectsFundingLeverages({ reportId });
	const previousProjectsFundingLeverages =
		previousReportId != null ? await getProjectsFundingLeverages({ reportId }) : null;

	return (
		<ProjectsFundingLeveragesFormContent
			comments={comments?.projectsFundingLeverages}
			previousProjectsFundingLeverages={previousProjectsFundingLeverages}
			previousReportId={previousReportId}
			projectsFundingLeverages={projectsFundingLeverages}
			reportId={reportId}
		/>
	);
}
