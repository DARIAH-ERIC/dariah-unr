import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${String(MOBILE_BREAKPOINT - 1)}px)`);

		function onChange() {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		}

		mql.addEventListener("change", onChange);

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

		return () => {
			mql.removeEventListener("change", onChange);
		};
	}, []);

	return Boolean(isMobile);
}
