import { cache } from "react";

import { getUserById as _getUserById, getUsers as _getUsers } from "@/lib/data/users";

export const getUserById = cache(_getUserById);
export const getUsers = cache(_getUsers);
