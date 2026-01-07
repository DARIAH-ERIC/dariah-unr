import { hasPersonWorkingGroupRole as _hasPersonWorkingGroupRole } from "@/lib/data/permissions";
import { cache } from "react";

export const hasPersonWorkingGroupRole = cache(_hasPersonWorkingGroupRole);
