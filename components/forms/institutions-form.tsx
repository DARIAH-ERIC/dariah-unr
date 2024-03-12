import type { Country, Report } from "@prisma/client";

import { InstitutionsFormContent } from "@/components/forms/institutions-form-content";
import { getPartnerInstitutionsByCountry } from "@/lib/data/institution";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface InstitutionsFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	reportId: Report["id"];
	year: number;
}

export async function InstitutionsForm(props: InstitutionsFormProps) {
	const { comments, countryId, reportId, year } = props;

	const institutions = await getPartnerInstitutionsByCountry({ countryId });

	return (
		<InstitutionsFormContent
			comments={comments?.institutions}
			countryId={countryId}
			institutions={institutions}
			reportId={reportId}
			year={year}
		/>
	);
}
