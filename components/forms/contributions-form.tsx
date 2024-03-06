import type { Country, Report } from "@prisma/client";
import type { ReactNode } from "react";

import { ContributionsFormContent } from "@/components/forms/contributions-form-content";
import { getContributionsByCountry } from "@/lib/data/contributions";
import { getPersonsByCountry } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ContributionsFormProps {
	comments: ReportCommentsSchema | null;
	contributionsCount: Report["contributionsCount"];
	countryId: Country["id"];
}

// @ts-expect-error Upstream type issue.
export async function ContributionsForm(props: ContributionsFormProps): Promise<ReactNode> {
	const { comments, contributionsCount, countryId } = props;

	const contributions = await getContributionsByCountry({ countryId });
	const persons = await getPersonsByCountry({ countryId });
	const roles = await getRoles();
	const workingGroups = await getWorkingGroups();

	return (
		<ContributionsFormContent
			comments={comments}
			contributions={contributions}
			contributionsCount={contributionsCount}
			countryId={countryId}
			persons={persons}
			roles={roles}
			workingGroups={workingGroups}
		/>
	);
}
