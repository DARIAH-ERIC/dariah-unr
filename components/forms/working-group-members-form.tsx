import type { Contribution, Person, Prisma, WorkingGroup } from "@prisma/client";
import type { ReactNode } from "react";

import { WorkingGroupMembersFormContent } from "@/components/forms/working-group-members-form-content";

interface WorkingGroupMembersFormParams {
	contributions: Array<Contribution>;
	persons: Array<Person>;
	roles: Array<Prisma.RoleGetPayload<{ select: { id: true; name: true; type: true } }>>;
	workingGroup: WorkingGroup;
}

export function WorkingGroupMembersForm(params: WorkingGroupMembersFormParams): ReactNode {
	const { contributions, persons, roles, workingGroup } = params;

	return (
		<WorkingGroupMembersFormContent
			contributions={contributions}
			persons={persons}
			roles={roles}
			workingGroup={workingGroup}
		/>
	);
}
