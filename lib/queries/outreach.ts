import { cache } from "react";
import {
	getOutreach as _getOutreach,
	getOutreachById as _getOutreachById,
} from "@/lib/data/outreach";

export const getOutreach = cache(_getOutreach);
export const getOutreachById = cache(_getOutreachById);
