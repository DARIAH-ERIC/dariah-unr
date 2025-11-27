import type { User } from "@prisma/client";

import { getCountryCodeByCountryId } from "@/lib/data/country";

export async function getDashboardPath(user: Omit<User, "password"> | null): Promise<string> {
	const defaultPath = "/dashboard";
	const countryId = user?.countryId;
	if (!countryId) return defaultPath;
	const userCountry = await getCountryCodeByCountryId({ id: countryId });
	return userCountry ? `/dashboard/countries/${userCountry.code}` : defaultPath;
}
