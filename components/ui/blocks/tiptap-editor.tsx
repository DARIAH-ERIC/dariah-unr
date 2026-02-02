"use client";

import { Bold } from "@tiptap/extension-bold";
import { Document } from "@tiptap/extension-document";
import { Link } from "@tiptap/extension-link";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extensions";
import { type Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react";
// eslint-disable-next-line import-x/no-named-as-default
import DOMPurify from "dompurify";
import { BoldIcon, LinkIcon, UnlinkIcon } from "lucide-react";
import { Fragment, type ReactNode, useId, useState } from "react";
import { DialogTrigger, Group } from "react-aria-components";
import { z } from "zod";

import { RequiredIndicator } from "@/components/ui/blocks/required-indicator";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogCancelButton,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FieldDescription } from "@/components/ui/field-description";
import { IconButton } from "@/components/ui/icon-button";
import { IconToggleButton } from "@/components/ui/icon-toggle-button";
import { Label } from "@/components/ui/label";
import { Modal, ModalOverlay } from "@/components/ui/modal";
import { variants } from "@/lib/styles";

const editorStyles = variants({
	base: [
		"block prose w-full min-w-0 min-h-20 appearance-none transition",
		"resize-none data-resizable:resize-y",
		"rounded-md px-3 py-1.5",
		"text-sm leading-normal text-neutral-950 placeholder:text-neutral-500 dark:text-neutral-0",
		"border border-neutral-950/10 hover:border-neutral-950/20 dark:border-neutral-0/10 dark:hover:border-neutral-0/20",
		"bg-neutral-0 dark:bg-neutral-0/5",
		"shadow-xs dark:shadow-none",
		"invalid:border-negative-500 invalid:shadow-negative-500/10 invalid:hover:border-negative-500 dark:invalid:border-negative-500 dark:invalid:hover:border-negative-500",
		"disabled:border-neutral-950/20 disabled:bg-neutral-950/5 disabled:opacity-50 disabled:shadow-none dark:disabled:border-neutral-0/15 dark:disabled:hover:border-neutral-0/15",
		"outline-solid outline-0 outline-neutral-950 invalid:outline-negative-500 focus:outline-1 focus-visible:outline-2 dark:outline-neutral-0 forced-colors:outline-[Highlight]",
	],
});

interface TipTapLink {
	href?: string;
	target?: string;
	rel?: string;
	class?: string;
	[key: string]: unknown;
}

interface TipTapEditorProps {
	defaultContent: string | null | undefined;
	description?: string;
	isLabelVisible?: boolean;
	isRequired?: boolean;
	label: string;
	name: string;
}

const allowedProtocols = ["http:", "https:", "mailto:"];

export function TiptapEditor(props: TipTapEditorProps): ReactNode {
	const { defaultContent, description, isLabelVisible = true, isRequired, label, name } = props;

	const [isOpen, setIsOpen] = useState(false);

	const [link, setLink] = useState<TipTapLink>({});

	const handleChange = (isOpen: boolean) => {
		setIsOpen(isOpen);
		if (isOpen) {
			const url = editorState?.link as TipTapLink;
			setLink(url);
		}
	};

	const [content, setContent] = useState(defaultContent);
	const editor = useEditor({
		editorProps: {
			attributes: {
				"aria-label": "Rich Text Editor",
				class: editorStyles(),
			},
		},
		extensions: [
			Document,
			Paragraph,
			Text,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
				protocols: allowedProtocols.map((protocol) => {
					return protocol.replace(":", "");
				}),
			}),
			Bold,
			Placeholder.configure({
				emptyEditorClass: "before:content-[attr(data-placeholder)]",
				placeholder: `Enter ${label}...`,
			}),
		],
		content: defaultContent,
		onUpdate({ editor }) {
			setContent(DOMPurify.sanitize(editor.getHTML()));
		},

		immediatelyRender: false,
	});

	const editorState = useEditorState({
		editor,
		selector: (ctx) => {
			return {
				isBold: ctx.editor?.isActive("bold"),
				isLink: ctx.editor?.isActive("link"),
				link: ctx.editor?.getAttributes("link"),
			};
		},
	});

	const editorId = useId();
	const labelId = useId();
	const descriptionId = useId();

	return (
		<>
			<Label className={isLabelVisible ? undefined : "sr-only"} id={labelId}>
				{label}
				<RequiredIndicator isVisible={isRequired} />
			</Label>
			<Group
				aria-describedby={description != null ? descriptionId : undefined}
				aria-labelledby={labelId}
				id={editorId}
			>
				<Group className="flex gap-x-1.5">
					<IconToggleButton
						aria-label={"toggle-bold"}
						isSelected={editorState?.isBold}
						onClick={() => {
							return editor?.chain().focus().toggleBold().run();
						}}
						variant="outline"
					>
						<BoldIcon aria-hidden={true} className="size-5 shrink-0" />
					</IconToggleButton>
					<DialogTrigger isOpen={isOpen} onOpenChange={handleChange}>
						<IconButton variant="outline">
							<LinkIcon aria-hidden={true} className="size-5 shrink-0" />
							<span className="sr-only">edit link</span>
						</IconButton>
						<EditLinkDialog editor={editor} link={link} />
					</DialogTrigger>
					<IconButton
						isDisabled={!editorState?.isLink}
						onClick={() => {
							return editor?.chain().focus().extendMarkRange("link").unsetLink().run();
						}}
						variant="outline"
					>
						<UnlinkIcon aria-hidden={true} className="size-5 shrink-0" />
						<span className="sr-only">remove link</span>
					</IconButton>
				</Group>
				<EditorContent className="mt-2 **:data-placeholder:text-muted" editor={editor} />
				<input name={name} type="hidden" value={content ?? ""} />
			</Group>
			{description != null ? (
				<FieldDescription id={descriptionId}>{description}</FieldDescription>
			) : null}
		</>
	);
}

interface EditLinkDialogProps {
	editor: Editor | null;
	link: TipTapLink;
}

function EditLinkDialog(props: EditLinkDialogProps): ReactNode {
	const { editor, link } = props;

	const urlSchema = z
		.string()
		.url()
		.refine((url) => {
			try {
				const parsedURL = new URL(url);
				return allowedProtocols.includes(parsedURL.protocol);
			} catch {
				return false;
			}
		});

	const isValidUrl = (url: string) => {
		return urlSchema.safeParse(url).success;
	};

	const [url, setUrl] = useState<string | undefined>(link.href);

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						const handleUpdate = () => {
							if (url) {
								editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
							}
							close();
						};

						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Edit Link</DialogTitle>
								</DialogHeader>

								<div>
									<TextInputField
										autoFocus={true}
										defaultValue={link.href}
										description={`allowed protocols: ${allowedProtocols.join(", ")}`}
										isRequired={true}
										label="Link"
										name="link"
										onChange={(v) => {
											setUrl(v);
										}}
									/>
								</div>
								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<Button isDisabled={!url || !isValidUrl(url)} onPress={handleUpdate}>
										Update
									</Button>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
