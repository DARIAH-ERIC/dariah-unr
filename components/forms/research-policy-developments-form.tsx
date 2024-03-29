import type { Report } from "@prisma/client";

import { ResearchPolicyDevelopmentsFormContent } from "@/components/forms/research-policy-developments-form-content";
import { getResearchPolicyDevelopments } from "@/lib/data/report";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ResearchPolicyDevelopmentsFormProps {
	comments: ReportCommentsSchema | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export async function ResearchPolicyDevelopmentsForm(props: ResearchPolicyDevelopmentsFormProps) {
	const { comments, previousReportId, reportId } = props;

	const researchPolicyDevelopments = await getResearchPolicyDevelopments({ reportId });
	const previousResearchPolicyDevelopments =
		previousReportId != null ? await getResearchPolicyDevelopments({ reportId }) : null;

	return (
		<ResearchPolicyDevelopmentsFormContent
			comments={comments?.researchPolicyDevelopments}
			previousReportId={previousReportId}
			previousResearchPolicyDevelopments={previousResearchPolicyDevelopments}
			reportId={reportId}
			researchPolicyDevelopments={researchPolicyDevelopments}
		/>
	);
}
