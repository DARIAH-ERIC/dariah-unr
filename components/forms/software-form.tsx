import type { Country } from "@prisma/client";
import type { ReactNode } from "react";

import { SoftwareFormContent } from "@/components/forms/software-form-content";
import { getSoftwareByCountry } from "@/lib/data/software";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface SoftwareFormProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
}

// @ts-expect-error Upstream type issue.
export async function SoftwareForm(props: SoftwareFormProps): Promise<ReactNode> {
	const { comments, countryId } = props;

	const softwares = await getSoftwareByCountry({ countryId });

	return <SoftwareFormContent comments={comments} countryId={countryId} softwares={softwares} />;
}
