"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import type { Contribution, Person, Prisma, WorkingGroup } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { type ReactNode, startTransition, useActionState, useMemo, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { IconButton } from "@/components/ui/icon-button";
import { updateWorkingGroupMembersAction } from "@/lib/actions/update-working-group-members";
import { createKey } from "@/lib/create-key";
import { toDateValue } from "@/lib/to-date-value";

interface WorkingGroupMembersFormContent {
	contributions: Array<Contribution>;
	persons: Array<Person>;
	roles: Array<Prisma.RoleGetPayload<{ select: { id: true; name: true; type: true } }>>;
	workingGroup: WorkingGroup;
}

export function WorkingGroupMembersFormContent(params: WorkingGroupMembersFormContent): ReactNode {
	const { contributions: _contributions, persons, roles, workingGroup } = params;

	const rolesByType = useMemo(() => {
		return keyByToMap(roles, (role) => {
			return role.type;
		});
	}, [roles]);

	const [formState, formAction] = useActionState(updateWorkingGroupMembersAction, undefined);

	const [contributions, setContributions] = useState<
		Array<
			Partial<{
				id: string;
				personId: string;
				roleId: string;
				startDate: Date | null;
				endDate: Date | null;
			}> & { _id?: string }
		>
	>(_contributions);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6 max-w-(--breakpoint-md)"
			onSubmit={(event) => {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				startTransition(async () => {
					await updateWorkingGroupMembersAction(formState, formData);
				});
			}}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="workingGroupId" type="hidden" value={workingGroup.id} />

			<div className="flex flex-col gap-4">
				{contributions.map((item, index) => {
					return (
						<div key={item.id ?? item._id} className="flex gap-4">
							{item.id ? (
								<input name={`members.${String(index)}.id`} type="hidden" value={item.id} />
							) : null}

							<input
								name={`members.${String(index)}.roleId`}
								type="hidden"
								value={rolesByType.get("wg_member")?.id}
							/>

							<SelectField
								className="w-64"
								defaultValue={item.personId ?? undefined}
								isRequired={true}
								label="Role"
								name={`members.${String(index)}.personId`}
							>
								{persons.map((person) => {
									return (
										<SelectItem key={person.id} id={person.id} textValue={person.name}>
											{person.name}
										</SelectItem>
									);
								})}
							</SelectField>

							<DateInputField
								className="w-32 shrink-0"
								defaultValue={item.startDate ? toDateValue(item.startDate) : undefined}
								granularity="day"
								label="Start date"
								name={`members.${String(index)}.startDate`}
							/>

							<DateInputField
								className="w-32 shrink-0"
								defaultValue={item.endDate ? toDateValue(item.endDate) : undefined}
								granularity="day"
								label="End date"
								name={`members.${String(index)}.endDate`}
							/>

							{item.id ? null : (
								<IconButton
									aria-label="Remove"
									onPress={() => {
										setContributions((items) => {
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
							setContributions((members) => {
								return [...members, { _id: crypto.randomUUID() }];
							});
						}}
					>
						Add member
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
