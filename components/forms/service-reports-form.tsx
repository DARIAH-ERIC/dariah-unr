import type { Country, Report } from "@prisma/client";
import type { ReactNode } from "react";

import { ServiceReportsFormContent } from "@/components/forms/service-reports-form-content";
import { getServiceReports } from "@/lib/data/report";
import { getServicesByCountry } from "@/lib/data/service";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ServiceReportsFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
	year: number;
}

// @ts-expect-error Upstream type issue.
export async function ServiceReportsForm(props: ServiceReportsFormProps): Promise<ReactNode> {
	const { comments, countryId, previousReportId, reportId, year } = props;

	const services = await getServicesByCountry({ countryId });

	const serviceReports = await getServiceReports({ reportId });
	const previousServiceReports =
		previousReportId != null ? await getServiceReports({ reportId }) : null;

	return (
		<ServiceReportsFormContent
			comments={comments}
			countryId={countryId}
			previousReportId={previousReportId}
			previousServiceReports={previousServiceReports}
			reportId={reportId}
			serviceReports={serviceReports}
			services={services}
			year={year}
		/>
	);
}
