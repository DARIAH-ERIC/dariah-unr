import * as v from "valibot";

export const SignInSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.nonEmpty()),
	to: v.optional(
		v.pipe(
			v.string(),
			v.nonEmpty(),
			v.check((input) => {
				return !input.includes("/auth");
			}),
		),
		"/dashboard",
	),
});
