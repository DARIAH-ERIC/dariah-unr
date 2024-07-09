export const publicRoutes: Array<RegExp | string> = [
	"/",
	/^\/api\/.*/,
	/** Auth routes are always treated as public. */
	// /^\/auth\/.*/,
	"/contact",
	/^\/documentation(\/.*)?/,
	"/imprint",
	"/keystatic",
	"/opengraph-image",
	"/privacy-policy",
	"/terms-of-use",
];
