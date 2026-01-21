import type { Person, Prisma } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { WorkingGroupFormContent } from "@/components/forms/working-group-form-content";

interface WorkingGroupFormParams {
	persons: Array<Person>;
	roles: Array<Prisma.RoleGetPayload<{ select: { id: true; name: true; type: true } }>>;
	workingGroup: Prisma.WorkingGroupGetPayload<{
		include: { chairs: true };
	}>;
}

export function WorkingGroupForm(params: WorkingGroupFormParams): ReactNode {
	const { persons, roles, workingGroup } = params;

	const _t = useTranslations("WorkingGroupForm");

	return <WorkingGroupFormContent persons={persons} roles={roles} workingGroup={workingGroup} />;
}
