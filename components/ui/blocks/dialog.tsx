import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
	Dialog as DialogContent,
	DialogActionButton,
	DialogCancelButton,
	DialogCloseButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Modal, ModalOverlay, type ModalOverlayProps } from "@/components/ui/modal";

interface DialogProps extends ModalOverlayProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	children?: ReactNode;
	description: ReactNode;
	onAction: () => void;
	title: ReactNode;
}

export function Dialog(props: DialogProps): ReactNode {
	const {
		actionLabel,
		cancelLabel,
		children,
		description,
		isDismissable = true,
		onAction,
		title,
		...rest
	} = props;

	const t = useTranslations("ui.Dialog");

	return (
		<ModalOverlay>
			<Modal {...rest} isDismissable={isDismissable}>
				<DialogContent>
					<DialogCloseButton aria-label={t("close")} />
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					{children}
					<DialogFooter>
						<DialogCancelButton>{cancelLabel}</DialogCancelButton>
						<DialogActionButton onPress={onAction}>{actionLabel}</DialogActionButton>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</ModalOverlay>
	);
}

export { DialogTrigger };
