import type { Country, Report } from "@prisma/client";
import type { ReactNode } from "react";

import { SoftwareFormContent } from "@/components/forms/software-form-content";
import { getSoftwareByCountry } from "@/lib/data/software";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface SoftwareFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	reportId: Report["id"];
}

// @ts-expect-error Upstream type issue.
export async function SoftwareForm(props: SoftwareFormProps): Promise<ReactNode> {
	const { comments, countryId, reportId } = props;

	const softwares = await getSoftwareByCountry({ countryId });

	return (
		<SoftwareFormContent
			comments={comments}
			countryId={countryId}
			reportId={reportId}
			softwares={softwares}
		/>
	);
}
