import type { Country, Report } from "@prisma/client";

import { OutreachReportsFormContent } from "@/components/forms/outreach-reports-form-content";
import { getOutreachByCountry } from "@/lib/data/outreach";
import { getOutreachReports } from "@/lib/data/report";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface OutreachReportsFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export async function OutreachReportsForm(props: OutreachReportsFormProps) {
	const { comments, countryId, previousReportId, reportId } = props;

	const outreachs = await getOutreachByCountry({ countryId });

	const outreachReports = await getOutreachReports({ reportId });
	const previousOutreachReports =
		previousReportId != null ? await getOutreachReports({ reportId }) : null;

	return (
		<OutreachReportsFormContent
			comments={comments?.outreach}
			countryId={countryId}
			outreachReports={outreachReports}
			outreachs={outreachs}
			previousOutreachReports={previousOutreachReports}
			previousReportId={previousReportId}
			reportId={reportId}
		/>
	);
}
