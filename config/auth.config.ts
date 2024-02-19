export const publicRoutes: Array<RegExp | string> = [
	/** Auth routes are always treated as public. */
	// new RegExp("^/auth/.*"),
	new RegExp("^/api/.*"),
	"/",
	"/imprint",
	new RegExp("^/documentation(/.*)?"),
];
