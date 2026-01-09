import { cache } from "react";

import {
	getInstitutionById as _getInstitutionById,
	getInstitutions as _getInstitutions,
	getInstitutionsByCountryCode as _getInstitutionsByCountryCode,
} from "@/lib/data/institutions";

export const getInstitutionById = cache(_getInstitutionById);
export const getInstitutions = cache(_getInstitutions);
export const getInstitutionsByCountryCode = cache(_getInstitutionsByCountryCode);
