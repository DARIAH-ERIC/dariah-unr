import { HelpCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Popover } from "@/components/ui/popover";

interface ContextualHelpProps {
	description: string;
	title: string;
	trigger: string;
}

export function ContextualHelp(props: ContextualHelpProps): ReactNode {
	const { description, title, trigger } = props;

	return (
		<DialogTrigger>
			<IconButton variant="plain">
				<HelpCircleIcon aria-hidden={true} className="size-5 shrink-0" />
				<span className="sr-only">{trigger}</span>
			</IconButton>
			<Popover>
				<Dialog>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
