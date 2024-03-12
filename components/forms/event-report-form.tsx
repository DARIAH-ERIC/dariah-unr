import type { Report } from "@prisma/client";
import type { ReactNode } from "react";

import { EventReportFormContent } from "@/components/forms/event-report-form-content";
import { getEventReport } from "@/lib/data/report";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface EventReportFormProps {
	comments: ReportCommentsSchema | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export async function EventReportForm(props: EventReportFormProps) {
	const { comments, previousReportId, reportId } = props;

	const eventReport = await getEventReport({ reportId });
	const previousEventReport =
		previousReportId != null ? await getEventReport({ reportId: previousReportId }) : null;

	return (
		<EventReportFormContent
			comments={comments?.eventReport}
			eventReport={eventReport}
			previousEventReport={previousEventReport}
			previousReportId={previousReportId}
			reportId={reportId}
		/>
	);
}
