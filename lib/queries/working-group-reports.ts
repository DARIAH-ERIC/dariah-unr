import { cache } from "react";

import {
	getWorkingGroupReportById as _getWorkingGroupReportById,
	getWorkingGroupReportByWorkingGroupSlugAndYear as _getWorkingGroupReportByWorkingGroupSlugAndYear,
	getWorkingGroupReports as _getWorkingGroupReports,
	getWorkingGroupReportsByWorkingGroupSlug as _getWorkingGroupReportsByWorkingGroupSlug,
} from "@/lib/data/working-group-reports";

export const getWorkingGroupReportById = cache(_getWorkingGroupReportById);
export const getWorkingGroupReportByWorkingGroupSlugAndYear = cache(
	_getWorkingGroupReportByWorkingGroupSlugAndYear,
);
export const getWorkingGroupReports = cache(_getWorkingGroupReports);
export const getWorkingGroupReportsByWorkingGroupSlug = cache(
	_getWorkingGroupReportsByWorkingGroupSlug,
);
