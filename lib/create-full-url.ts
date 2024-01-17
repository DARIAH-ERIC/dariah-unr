import {
	createUrl,
	type CreateUrlParams,
	createUrlSearchParams,
	type CreateUrlSearchParamsParams,
} from "@acdh-oeaw/lib";
import { ReadonlyURLSearchParams } from "next/navigation";

import { env } from "@/config/env.config";

export interface CreateFullUrlParams extends Omit<CreateUrlParams, "baseUrl" | "searchParams"> {
	baseUrl?: CreateUrlParams["baseUrl"];
	searchParams?: CreateUrlSearchParamsParams | ReadonlyURLSearchParams;
}

export function createFullUrl(params: CreateFullUrlParams): URL {
	const { baseUrl = env.NEXT_PUBLIC_APP_BASE_URL, pathname, searchParams, hash } = params;

	return createUrl({
		baseUrl,
		pathname,
		searchParams:
			searchParams != null
				? searchParams instanceof URLSearchParams || searchParams instanceof ReadonlyURLSearchParams
					? searchParams
					: createUrlSearchParams(searchParams)
				: undefined,
		hash,
	});
}
