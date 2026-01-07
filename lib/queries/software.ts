import { cache } from "react";
import {
	getSoftware as _getSoftware,
	getSoftwareById as _getSoftwareById,
} from "@/lib/data/software";

export const getSoftware = cache(_getSoftware);
export const getSoftwareById = cache(_getSoftwareById);
