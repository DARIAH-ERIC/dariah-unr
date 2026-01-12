import type { Country, Report } from "@prisma/client";

import { ServiceReportsFormContent } from "@/components/forms/service-reports-form-content";
import { env } from "@/config/env.config";
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

export async function ServiceReportsForm(props: ServiceReportsFormProps) {
	const { comments, countryId, previousReportId: _previousReportId, reportId, year } = props;

	const services = await getServicesByCountry({ countryId });

	const serviceReports = await getServiceReports({ reportId });
	// const previousServiceReports =
	// 	previousReportId != null ? await getServiceReports({ reportId }) : null;

	return (
		<ServiceReportsFormContent
			comments={comments?.serviceReports}
			// previousServiceReports={previousServiceReports}
			reportId={reportId}
			serviceReports={serviceReports}
			services={services}
			sshompBaseUrl={env.SSHOC_MARKETPLACE_BASE_URL}
			year={year}
		/>
	);
}
