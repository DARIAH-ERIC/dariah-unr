"use client";

import { type ReactNode, useActionState, useEffect } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { createImageAction } from "@/lib/actions/create-image-action";

interface UploadImageFormProps {
	onUploadSuccess: () => void;
}

export function UploadImageForm(props: UploadImageFormProps): ReactNode {
	const { onUploadSuccess } = props;
	const [formState, action] = useActionState(createImageAction, undefined);

	useEffect(() => {
		if (formState?.status === "success") {
			onUploadSuccess();
		}
	}, [formState?.status, onUploadSuccess]);

	return (
		<Form
			action={action}
			className="grid gap-y-8"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			{/*	<FormStatus state={state} />*/}

			<label className="border border-dashed">
				<div>Select an image to upload</div>
				<input accept="image/png, image/jpeg" name="file" required={true} type="file" />
			</label>

			<div>
				<SubmitButton>Upload image</SubmitButton>
			</div>
		</Form>
	);
}
