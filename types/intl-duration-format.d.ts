/** @see {@link https://github.com/microsoft/TypeScript/issues/60608} */

declare namespace Intl {
	class DurationFormat {
		constructor(
			locales?: string | Array<string>,
			options?: {
				style?: "long" | "short" | "narrow" | "digital";
				years?: "long" | "short" | "narrow";
				months?: "long" | "short" | "narrow";
				weeks?: "long" | "short" | "narrow";
				days?: "long" | "short" | "narrow";
				hours?: "long" | "short" | "narrow";
				minutes?: "long" | "short" | "narrow";
				seconds?: "long" | "short" | "narrow";
				milliseconds?: "long" | "short" | "narrow";
			},
		);

		format(duration: Record<string, number>): string;
	}
}
