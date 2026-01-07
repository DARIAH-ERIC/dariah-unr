import type { ReactNode } from "react";

import { NavLink } from "@/app/(app)/[locale]/(default)/_components/nav-link";
import { Logo } from "@/components/logo";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";

interface NavigationProps {
	label: string;
	navigation: NavigationConfig & { home: NavigationLink };
}

export function Navigation(props: Readonly<NavigationProps>): ReactNode {
	const { label, navigation } = props;

	return (
		<nav aria-label={label} className="hidden lg:flex lg:gap-x-6">
			<NavLink href={navigation.home.href} size="icon">
				<span className="sr-only">{navigation.home.label}</span>
				<Logo className="h-8 w-auto" />
			</NavLink>

			<ul className="flex flex-wrap items-center" role="list">
				{Object.entries(navigation).map(([id, item]) => {
					switch (item.type) {
						case "action": {
							return <li key={id}></li>;
						}

						case "link": {
							return (
								<li key={id}>
									<NavLink href={item.href} size="md">
										{item.label}
									</NavLink>
								</li>
							);
						}

						case "menu": {
							return <li key={id}></li>;
						}

						case "separator": {
							return <li key={id}></li>;
						}
					}
				})}
			</ul>
		</nav>
	);
}
