import type { Country, Report } from "@prisma/client";
import type { ReactNode } from "react";

import { InstitutionsFormContent } from "@/components/forms/institutions-form-content";
import { getActivePartnerInstitutionsByCountry } from "@/lib/data/institution";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface InstitutionsFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	reportId: Report["id"];
	year: number;
}

// @ts-expect-error Upstream type issue.
export async function InstitutionsForm(props: InstitutionsFormProps): Promise<ReactNode> {
	const { comments, countryId, reportId, year } = props;

	const institutions = await getActivePartnerInstitutionsByCountry({ countryId });

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
