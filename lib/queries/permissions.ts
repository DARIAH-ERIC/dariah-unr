import { cache } from "react";

import { hasPersonWorkingGroupRole as _hasPersonWorkingGroupRole } from "@/lib/data/permissions";

export const hasPersonWorkingGroupRole = cache(_hasPersonWorkingGroupRole);
