export const publicRoutes: Array<RegExp | string> = [
	/** Auth routes are always treated as public. */
	// new RegExp("^/auth/.*"),
	new RegExp("^/api/.*"),
	"/",
	"/contact",
	"/imprint",
	"/privacy-policy",
	"/terms-of-use",
	"/cms",
	"/keystatic",
	new RegExp("^/documentation(/.*)?"),
];
