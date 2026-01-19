"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean | undefined {
	const [value, setValue] = useState<boolean | undefined>();

	useEffect(() => {
		const onChange = (event: MediaQueryListEvent) => {
			setValue(event.matches);
		};

		const result = matchMedia(query);
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setValue(result.matches);

		result.addEventListener("change", onChange);

		return () => {
			result.removeEventListener("change", onChange);
		};
	}, [query]);

	return value;
}
