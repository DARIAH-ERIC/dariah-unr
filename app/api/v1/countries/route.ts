import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import { db } from "@/lib/db";

const maxLimit = 100;
const defaultLimit = 25;

const SearchParamsSchema = v.object({
	limit: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.integer(),
			v.minValue(1),
			v.maxValue(maxLimit),
		),
		String(defaultLimit),
	),
	offset: v.nullish(
		v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(0)),
		"0",
	),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const url = new URL(request.url);

		const { limit, offset } = await v.parseAsync(SearchParamsSchema, {
			limit: url.searchParams.get("limit"),
			offset: url.searchParams.get("offset"),
		});

		const [countries, total] = await Promise.all([
			db.country.findMany({
				take: limit,
				skip: offset,
			}),
			db.country.count(),
		]);

		const data = countries.map((country) => {
			return {
				name: country.name,
				code: country.code,
				startDate: country.startDate,
				endDate: country.endDate,
				type: country.type,
				sshOpenMarketplaceId: country.marketplaceId,
			};
		});

		return NextResponse.json({
			data,
			pagination: {
				limit,
				offset,
				total,
			},
		});
	} catch (error) {
		if (v.isValiError(error)) {
			return NextResponse.json({ message: "Invalid input" }, { status: 400 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
