import type { Country, Report } from "@prisma/client";

import { ContributionsFormContent } from "@/components/forms/contributions-form-content";
import { getContributionsByCountryAndYear } from "@/lib/data/contributions";
import { getPersonsByCountry } from "@/lib/data/person";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ContributionsFormProps {
	comments: ReportCommentsSchema | null;
	contributionsCount: Report["contributionsCount"];
	countryId: Country["id"];
	previousContributionsCount: Report["contributionsCount"] | undefined;
	reportId: Report["id"];
	year: number;
}

export async function ContributionsForm(props: ContributionsFormProps) {
	const { comments, contributionsCount, countryId, previousContributionsCount, reportId, year } =
		props;

	const contributions = await getContributionsByCountryAndYear({ countryId, year });
	const persons = await getPersonsByCountry({ countryId });
	const roles = await getRoles();
	const workingGroups = await getWorkingGroups();

	return (
		<ContributionsFormContent
			comments={comments?.contributions}
			contributions={contributions}
			contributionsCount={contributionsCount}
			countryId={countryId}
			persons={persons}
			previousContributionsCount={previousContributionsCount}
			reportId={reportId}
			roles={roles}
			workingGroups={workingGroups}
			year={year}
		/>
	);
}
