import { cache } from "react";

import {
	getUserByEmail as _getUserByEmail,
	getUserById as _getUserById,
	getUsers as _getUsers,
} from "@/lib/data/users";

export const getUserByEmail = cache(_getUserByEmail);
export const getUserById = cache(_getUserById);
export const getUsers = cache(_getUsers);
