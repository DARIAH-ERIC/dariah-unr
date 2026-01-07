import type { ReactNode } from "react";

import { env } from "@/config/env.config";

export function TailwindIndicator(): ReactNode {
	if (env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div className="fixed right-5 bottom-5 z-10 grid size-9 cursor-default place-content-center rounded-full bg-[#000c] font-code text-xs font-medium text-white shadow-[0_0_0_1px_#171717,inset_0_0_0_1px_#ffffff24,0px_16px_32px_-8px_#0000003d] backdrop-blur-[48px] select-none">
			<span className="sr-only">{"Breakpoint: "}</span>
			<span className="block xs:hidden">{"2xs"}</span>
			<span className="hidden xs:block sm:hidden">{"xs"}</span>
			<span className="hidden sm:block md:hidden">{"sm"}</span>
			<span className="hidden md:block lg:hidden">{"md"}</span>
			<span className="hidden lg:block xl:hidden">{"lg"}</span>
			<span className="hidden xl:block 2xl:hidden">{"xl"}</span>
			<span className="hidden 2xl:block 3xl:hidden">{"2xl"}</span>
			<span className="hidden 3xl:block">{"3xl"}</span>
		</div>
	);
}
