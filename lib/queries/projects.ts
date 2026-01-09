import { cache } from "react";

import {
	getProjectById as _getProjectById,
	getProjects as _getProjects,
} from "@/lib/data/projects";

export const getProjectById = cache(_getProjectById);
export const getProjects = cache(_getProjects);
