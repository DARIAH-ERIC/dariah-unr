"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import type { Person, Prisma } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { type ReactNode, startTransition, useActionState, useMemo, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { IconButton } from "@/components/ui/icon-button";
import { updateWorkingGroupAction } from "@/lib/actions/update-working-group";
import { createKey } from "@/lib/create-key";
import { toDateValue } from "@/lib/to-date-value";

interface WorkingGroupFormParamsContent {
	persons: Array<Person>;
	roles: Array<Prisma.RoleGetPayload<{ select: { id: true; name: true; type: true } }>>;
	workingGroup: Prisma.WorkingGroupGetPayload<{
		include: { chairs: true };
	}>;
}

export function WorkingGroupFormContent(params: WorkingGroupFormParamsContent): ReactNode {
	const { persons, roles, workingGroup } = params;

	const [formState, formAction] = useActionState(updateWorkingGroupAction, undefined);

	const rolesByType = useMemo(() => {
		return keyByToMap(roles, (role) => {
			return role.type;
		});
	}, [roles]);

	const [chairs, setChairs] = useState<
		Array<
			Partial<{
				id?: string;
				endDate: Date | null;
				startDate: Date | null;
				personId: string;
			}> & { _id?: string }
		>
	>(workingGroup.chairs);

	// const [members, setMembers] = useState<
	// 	Array<
	// 		Partial<{
	// 			id?: string;
	// 			endDate: Date | null;
	// 			startDate: Date | null;
	// 			personId: string;
	// 		}> & { _id?: string }
	// 	>
	// >(workingGroup.members);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6 max-w-(--breakpoint-md)"
			onSubmit={(event) => {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				startTransition(async () => {
					await updateWorkingGroupAction(formState, formData);
				});
			}}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="id" type="hidden" value={workingGroup.id} />

			<TextInputField
				defaultValue={workingGroup.contactEmail ?? undefined}
				label="Contact email"
				name="contactEmail"
				type="email"
			/>

			<TextInputField
				defaultValue={workingGroup.mailingList ?? undefined}
				label="Mailing list"
				name="mailingList"
			/>

			<TextInputField
				defaultValue={workingGroup.memberTracking ?? undefined}
				label="Member tracking"
				name="memberTracking"
			/>

			<DateInputField
				defaultValue={workingGroup.startDate ? toDateValue(workingGroup.startDate) : undefined}
				label="Start date"
				name="startDate"
			/>

			<DateInputField
				defaultValue={workingGroup.endDate ? toDateValue(workingGroup.endDate) : undefined}
				label="End date"
				name="endDate"
			/>

			<div className="flex flex-col gap-4">
				<h2 className="text-lg font-semibold">Chairs</h2>

				{chairs.map((chair, index) => {
					return (
						<div key={chair.id ?? chair._id} className="flex gap-4">
							{chair.id ? (
								<input name={`chairs.${String(index)}.id`} type="hidden" value={chair.id} />
							) : null}

							<input
								name={`chairs.${String(index)}.roleId`}
								type="hidden"
								value={rolesByType.get("wg_chair")?.id}
							/>

							<SelectField
								className="w-64"
								defaultValue={chair.personId ?? undefined}
								isRequired={true}
								label="Name"
								name={`chairs.${String(index)}.personId`}
							>
								{persons.map((person) => {
									return (
										<SelectItem key={person.name} id={person.id} textValue={person.name}>
											{person.name}
										</SelectItem>
									);
								})}
							</SelectField>

							<DateInputField
								className="w-32 shrink-0"
								defaultValue={chair.startDate ? toDateValue(chair.startDate) : undefined}
								granularity="day"
								label="Start date"
								name={`chairs.${String(index)}.startDate`}
							/>

							<DateInputField
								className="w-32 shrink-0"
								defaultValue={chair.endDate ? toDateValue(chair.endDate) : undefined}
								granularity="day"
								label="End date"
								name={`chairs.${String(index)}.endDate`}
							/>
							{chair.id ? null : (
								<IconButton
									aria-label="Remove"
									onPress={() => {
										setChairs((chairs) => {
											return chairs.filter((event, i) => {
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
							setChairs((chairs) => {
								return [...chairs, { _id: crypto.randomUUID() }];
							});
						}}
					>
						Add chair
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
