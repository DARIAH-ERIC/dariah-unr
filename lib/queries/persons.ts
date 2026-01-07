import { cache } from "react";
import { getPersonById as _getPersonById, getPersons as _getPersons } from "@/lib/data/persons";

export const getPersonById = cache(_getPersonById);
export const getPersons = cache(_getPersons);
