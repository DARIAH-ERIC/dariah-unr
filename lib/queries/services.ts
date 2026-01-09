import { cache } from "react";

import {
	getServiceById as _getServiceById,
	getServices as _getServices,
} from "@/lib/data/services";

export const getServiceById = cache(_getServiceById);
export const getServices = cache(_getServices);
