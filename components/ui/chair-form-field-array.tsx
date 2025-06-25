import { parseAbsoluteToLocal } from "@internationalized/date";
import type { Contribution, Person } from "@prisma/client";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Group, Label } from "react-aria-components";
import { type Control, useFieldArray } from "react-hook-form";

import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { FormFieldArray, FormFieldArrayButton } from "@/components/ui/form-field-array";
import { IconButton } from "@/components/ui/icon-button";

export interface ChairFormValues {
	contributionId?: string;
	personId: string;
	startDate: Date | null;
	endDate: Date | null;
}

export interface ChairFormFieldArrayProps {
	chairsById: Map<Contribution["id"], Contribution>;
	control: Control<{ chairs: Array<ChairFormValues> }>;
	persons: Array<Person>;
}

export function ChairFormFieldArray(props: ChairFormFieldArrayProps) {
	const { persons, control } = props;
	const { fields, append, remove } = useFieldArray<{ chairs: Array<ChairFormValues> }>({
		control,
		name: "chairs",
	});

	return (
		<FormFieldArray className="flex flex-col gap-3">
			{fields.map((field, index: number) => {
				const { contributionId, personId, endDate, startDate } = field;
				//const chair = chairsById.get(chairId);
				return (
					<div key={field.id}>
						<Label>Chair</Label>
						<Group className="flex min-w-full place-items-end gap-2">
							<input name={`chairs.${String(index)}.id`} type="hidden" value={contributionId} />
							<SelectField
								className="w-64"
								defaultSelectedKey={personId}
								label="Name"
								name={`chairs.${String(index)}.personId`}
							>
								{persons.map((person: Person) => {
									return (
										<SelectItem key={person.name} id={person.id} textValue={person.name}>
											{person.name}
										</SelectItem>
									);
								})}
							</SelectField>
							<DateInputField
								className="w-32 shrink-0"
								defaultValue={startDate ? parseAbsoluteToLocal(startDate.toISOString()) : undefined}
								granularity="day"
								label="Start date"
								name={`chairs.${String(index)}.startDate`}
							/>
							<DateInputField
								className="w-32 shrink-0"
								defaultValue={endDate ? parseAbsoluteToLocal(endDate.toISOString()) : undefined}
								granularity="day"
								label="End date"
								name={`chairs.${String(index)}.endDate`}
							/>
							<IconButton
								className="mx-auto"
								onPress={() => {
									remove(index);
								}}
							>
								<TrashIcon aria-hidden={true} className="size-5 shrink-0" />
								<span className="sr-only">Remove</span>
							</IconButton>
						</Group>
					</div>
				);
			})}
			<FormFieldArrayButton
				className="mt-4 text-xs"
				onPress={() => {
					append({ personId: "", startDate: null, endDate: null });
				}}
			>
				<PlusIcon aria-hidden={true} className="size-3 shrink-0" />
				Add Chair
			</FormFieldArrayButton>
		</FormFieldArray>
	);
}
