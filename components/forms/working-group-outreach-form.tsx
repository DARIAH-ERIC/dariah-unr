import type { WorkingGroup, WorkingGroupOutreach } from "@prisma/client";
import type { ReactNode } from "react";

import { WorkingGroupOutreachFormContent } from "@/components/forms/working-group-outreach-form-content";

interface WorkingGroupOutreachFormParams {
	outreach: Array<WorkingGroupOutreach>;
	workingGroup: WorkingGroup;
}

export function WorkingGroupOutreachForm(params: WorkingGroupOutreachFormParams): ReactNode {
	const { outreach, workingGroup } = params;

	return <WorkingGroupOutreachFormContent outreach={outreach} workingGroup={workingGroup} />;
}
