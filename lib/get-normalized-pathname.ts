import { locales } from "@/config/i18n.config";

export function getNormalizedPathname(pathname: string) {
	if (!pathname.endsWith("/")) {
		// eslint-disable-next-line no-param-reassign
		pathname += "/";
	}

	const match = pathname.match(`^/(${locales.join("|")})/(.*)`);
	let result = match ? "/" + match[2] : pathname;

	if (result !== "/") {
		result = normalizeTrailingSlash(result);
	}

	return result;
}

function normalizeTrailingSlash(pathname: string) {
	if (pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}

	return pathname;
}
