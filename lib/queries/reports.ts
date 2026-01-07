import { cache } from "react";
import {
	getReportByCountryCodeAndYear as _getReportByCountryCodeAndYear,
	getReportById as _getReportById,
	getReports as _getReports,
	getReportsByCountryCode as _getReportsByCountryCode,
} from "@/lib/data/reports";

export const getReportByCountryCodeAndYear = cache(_getReportByCountryCodeAndYear);
export const getReportById = cache(_getReportById);
export const getReports = cache(_getReports);
export const getReportsByCountryCode = cache(_getReportsByCountryCode);
