import type { useRouter } from "@/lib/navigation/navigation";

type RouterPushParams = Parameters<ReturnType<typeof useRouter>["push"]>;

/** @see {@link https://react-spectrum.adobe.com/react-aria/routing.html#router-options} */
declare module "react-aria-components" {
	interface RouterConfig {
		href: NonNullable<RouterPushParams[0]>;
		routerOptions: NonNullable<RouterPushParams[1]>;
	}
}
