import { cache } from "react";

import {
	getCountries as _getCountries,
	getCountryByCode as _getCountryByCode,
	getCountryById as _getCountryById,
} from "@/lib/data/countries";

export const getCountries = cache(_getCountries);
export const getCountryByCode = cache(_getCountryByCode);
export const getCountryById = cache(_getCountryById);
