"use client";

import type { Report } from "@prisma/client";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updatePublicationsAction } from "@/lib/actions/update-publications";
import { createKey } from "@/lib/create-key";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface PublicationsFormContentProps {
	comments: ReportCommentsSchema["publications"];
	publications: Array<{
		id: string;
		// title: string;
		// kind: string;
		// url?: string;
		// creators: string;
		citation: string;
	}>;
	reportId: Report["id"];
}

export function PublicationsFormContent(props: PublicationsFormContentProps): ReactNode {
	const { comments, publications, reportId } = props;

	const [formState, formAction] = useFormState(updatePublicationsAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			{publications.length > 0 ? (
				<ul
					className="grid max-w-screen-md gap-y-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
					role="list"
				>
					{publications.map((publication) => {
						const { id, citation } = publication;

						return (
							<li key={id}>
								<article>
									<span dangerouslySetInnerHTML={{ __html: citation }} />
								</article>
							</li>
						);
					})}
				</ul>
			) : (
				<div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
					Empty zotero collection.
				</div>
			)}

			<TextAreaField defaultValue={comments} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage key={createKey("form-success", formState?.timestamp)}>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage key={createKey("form-error", formState?.timestamp)}>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}
