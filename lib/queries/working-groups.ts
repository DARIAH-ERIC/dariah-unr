import { cache } from "react";
import {
	getWorkingGroupById as _getWorkingGroupById,
	getWorkingGroupBySlug as _getWorkingGroupBySlug,
	getWorkingGroups as _getWorkingGroups,
	getWorkingGroupsByPersonId as _getWorkingGroupsByPersonId,
} from "@/lib/data/working-groups";

export const getWorkingGroupById = cache(_getWorkingGroupById);
export const getWorkingGroupBySlug = cache(_getWorkingGroupBySlug);
export const getWorkingGroups = cache(_getWorkingGroups);
export const getWorkingGroupsByPersonId = cache(_getWorkingGroupsByPersonId);
