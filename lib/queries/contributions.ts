import {
	getContributionById as _getContributionById,
	getContributions as _getContributions,
	getContributionsByCountryCode as _getContributionsByCountryCode,
} from "@/lib/data/contributions";
import { cache } from "react";

export const getContributionById = cache(_getContributionById);
export const getContributions = cache(_getContributions);
export const getContributionsByCountryCode = cache(_getContributionsByCountryCode);
