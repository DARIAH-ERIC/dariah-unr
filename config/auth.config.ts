export const publicRoutes: Array<RegExp | string> = [
	"/",
	new RegExp("^/api/.*"),
	/** Auth routes are always treated as public. */
	// new RegExp("^/auth/.*"),
	"/contact",
	new RegExp("^/documentation(/.*)?"),
	"/imprint",
	"/keystatic",
	"/opengraph-image",
	"/privacy-policy",
	"/terms-of-use",
];
