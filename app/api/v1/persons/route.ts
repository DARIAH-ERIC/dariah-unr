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

		const [people, total] = await Promise.all([
			db.person.findMany({
				take: limit,
				skip: offset,
			}),
			db.person.count(),
		]);

		const data = people.map((person) => {
			return {
				name: person.name,
				// FIXME: is it legally ok to return these from a public api endpoint?
				// email: person.email,
				// orcid: person.orcid,
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
