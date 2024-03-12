import type { Country, Report } from "@prisma/client";

import { SoftwareFormContent } from "@/components/forms/software-form-content";
import { getSoftwareByCountry } from "@/lib/data/software";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface SoftwareFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	reportId: Report["id"];
}

export async function SoftwareForm(props: SoftwareFormProps) {
	const { comments, countryId, reportId } = props;

	const softwares = await getSoftwareByCountry({ countryId });

	return (
		<SoftwareFormContent
			comments={comments?.software}
			countryId={countryId}
			reportId={reportId}
			softwares={softwares}
		/>
	);
}
