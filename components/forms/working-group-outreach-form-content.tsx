"use client";

import {
	type WorkingGroup,
	type WorkingGroupOutreach,
	WorkingGroupOutreachType,
} from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { type ReactNode, startTransition, useActionState, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { IconButton } from "@/components/ui/icon-button";
import { updateWorkingGroupOutreachAction } from "@/lib/actions/update-working-group-outreach";
import { createKey } from "@/lib/create-key";
import { toDateValue } from "@/lib/to-date-value";

interface WorkingGroupOutreachFormContent {
	outreach: Array<WorkingGroupOutreach>;
	workingGroup: WorkingGroup;
}

export function WorkingGroupOutreachFormContent(
	params: WorkingGroupOutreachFormContent,
): ReactNode {
	const { outreach: _outreach, workingGroup } = params;

	const [formState, formAction] = useActionState(updateWorkingGroupOutreachAction, undefined);

	const [outreach, setOutreach] = useState<
		Array<
			Partial<{
				id: string;
				name: string;
				type: WorkingGroupOutreachType;
				startDate: Date | null;
				endDate: Date | null;
				url: string;
			}> & { _id?: string }
		>
	>(_outreach);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6 max-w-(--breakpoint-md)"
			onSubmit={(event) => {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				startTransition(async () => {
					await updateWorkingGroupOutreachAction(formState, formData);
				});
			}}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="workingGroupId" type="hidden" value={workingGroup.id} />

			<div className="flex flex-col gap-4">
				{outreach.map((item, index) => {
					return (
						<div key={item.id ?? item._id} className="flex gap-4">
							{item.id ? (
								<input name={`outreach.${String(index)}.id`} type="hidden" value={item.id} />
							) : null}

							<TextInputField
								defaultValue={item.name ?? undefined}
								isRequired={true}
								label="Name"
								name={`outreach.${String(index)}.name`}
							/>

							<TextInputField
								className="w-72"
								defaultValue={item.url ?? undefined}
								isRequired={true}
								label="URL"
								name={`outreach.${String(index)}.url`}
							/>

							<SelectField
								className="w-64"
								defaultValue={item.type ?? undefined}
								isRequired={true}
								label="Type"
								name={`outreach.${String(index)}.type`}
							>
								{Object.values(WorkingGroupOutreachType).map((type) => {
									return (
										<SelectItem key={type} id={type} textValue={type}>
											{type}
										</SelectItem>
									);
								})}
							</SelectField>

							<DateInputField
								className="w-32 shrink-0"
								defaultValue={item.startDate ? toDateValue(item.startDate) : undefined}
								granularity="day"
								label="Start date"
								name={`outreach.${String(index)}.startDate`}
							/>

							<DateInputField
								className="w-32 shrink-0"
								defaultValue={item.endDate ? toDateValue(item.endDate) : undefined}
								granularity="day"
								label="End date"
								name={`outreach.${String(index)}.endDate`}
							/>

							{item.id ? null : (
								<IconButton
									aria-label="Remove"
									onPress={() => {
										setOutreach((items) => {
											return items.filter((item, i) => {
												return i !== index;
											});
										});
									}}
								>
									<Trash2Icon aria-hidden={true} className="size-5 shrink-0" />
								</IconButton>
							)}
						</div>
					);
				})}

				<div>
					<Button
						onPress={() => {
							setOutreach((outreach) => {
								return [...outreach, { _id: crypto.randomUUID() }];
							});
						}}
					>
						Add outreach
					</Button>
				</div>
			</div>

			<div>
				<SubmitButton>Save</SubmitButton>
			</div>

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
