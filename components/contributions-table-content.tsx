"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Person, Prisma, Role, WorkingGroup } from "@prisma/client";
import { MoreHorizontalIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useFormatter } from "next-intl";
import { Fragment, type ReactNode, useActionState, useId, useMemo, useState } from "react";
import type { Key } from "react-aria-components";

import { Pagination } from "@/components/admin/pagination";
import { usePagination } from "@/components/admin/use-pagination";
import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogCancelButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { IconButton } from "@/components/ui/icon-button";
import { Modal, ModalOverlay } from "@/components/ui/modal";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "@/components/ui/table";
import { createContributionAction } from "@/lib/actions/admin/create-contribution";
import { updateContributionAction } from "@/lib/actions/admin/update-contribution";
import { createKey } from "@/lib/create-key";
import { toDateValue } from "@/lib/to-date-value";

type Action =
	| {
			kind: "create";
			item: null;
	  }
	| {
			kind: "edit";
			item: Prisma.ContributionGetPayload<{
				include: {
					person: { select: { id: true } };
					role: { select: { id: true } };
					country: { select: { id: true } };
					workingGroup: { select: { id: true } };
				};
			}>;
	  };

interface ContributionsTableContentProps {
	countries: Array<Country>;
	persons: Array<Person>;
	roles: Array<Pick<Role, "id" | "name" | "type">>;
	workingGroups: Array<WorkingGroup>;
	contributions: Array<
		Prisma.ContributionGetPayload<{
			include: {
				country: { select: { id: true; name: true } };
				person: { select: { id: true; name: true } };
				role: { select: { id: true; name: true } };
				workingGroup: { select: { id: true; name: true } };
			};
		}>
	>;
	hideFilter?: boolean;
}

export function ContributionsTableContent(props: ContributionsTableContentProps): ReactNode {
	const { countries, contributions, persons, roles, workingGroups } = props;

	const { dateTime } = useFormatter();

	const countriesById = useMemo(() => {
		return keyByToMap(countries, (country) => {
			return country.id;
		});
	}, [countries]);

	const personsById = useMemo(() => {
		return keyByToMap(persons, (person) => {
			return person.id;
		});
	}, [persons]);

	const rolesById = useMemo(() => {
		return keyByToMap(roles, (role) => {
			return role.id;
		});
	}, [roles]);

	const workingGroupsById = useMemo(() => {
		return keyByToMap(workingGroups, (workingGroup) => {
			return workingGroup.id;
		});
	}, [workingGroups]);

	const [action, setAction] = useState<Action | null>(null);

	function onDialogClose() {
		setAction(null);
	}

	const [sortDescriptor, setSortDescriptor] = useState({
		column: "person" as "person" | "role" | "workingGroup" | "country" | "startDate" | "endDate",
		direction: "ascending" as "ascending" | "descending",
	});

	const items = useMemo(() => {
		const items = contributions.toSorted((a, z) => {
			switch (sortDescriptor.column) {
				case "country": {
					const countryA = a.country?.name ?? "";
					const countryZ = z.country?.name ?? "";

					return countryA.localeCompare(countryZ);
				}

				case "person": {
					const personA = a.person.name;
					const personZ = z.person.name;

					return personA.localeCompare(personZ);
				}

				case "role": {
					const roleA = a.role.name;
					const roleZ = z.role.name;

					return roleA.localeCompare(roleZ);
				}

				case "workingGroup": {
					const workingGroupA = a.country?.name ?? "";
					const workingGroupZ = z.country?.name ?? "";

					return workingGroupA.localeCompare(workingGroupZ);
				}

				case "startDate":
				case "endDate": {
					const dateA = a[sortDescriptor.column]?.getTime() ?? 0;
					const dateZ = z[sortDescriptor.column]?.getTime() ?? 0;

					return dateA - dateZ;
				}
			}
		});

		if (sortDescriptor.direction === "descending") {
			items.reverse();
		}

		return items;
	}, [sortDescriptor, contributions]);

	const pagination = usePagination({ items });

	return (
		<Fragment>
			<div className="flex justify-end">
				<Button
					onPress={() => {
						setAction({ kind: "create", item: null });
					}}
				>
					<PlusIcon aria-hidden={true} className="size-5 shrink-0" />
					<span>Create</span>
				</Button>
			</div>

			<div className="flex justify-end">
				<Pagination pagination={pagination} />
			</div>

			<Table
				aria-label="Services"
				className="w-full"
				// @ts-expect-error It's fine.
				onSortChange={setSortDescriptor}
				selectionMode="none"
				sortDescriptor={sortDescriptor}
			>
				<TableHeader>
					<Column allowsSorting={true} id="person" isRowHeader={true}>
						Person
					</Column>
					<Column allowsSorting={true} id="role">
						Role
					</Column>
					<Column allowsSorting={true} id="workingGroup">
						Working Group
					</Column>
					<Column allowsSorting={true} id="Country">
						Country
					</Column>
					<Column allowsSorting={true} id="startDate">
						Start date
					</Column>
					<Column allowsSorting={true} id="endDate">
						End date
					</Column>
					<Column defaultWidth={50} id="actions">
						Actions
					</Column>
				</TableHeader>
				<TableBody items={pagination.currentItems}>
					{(row) => {
						function onAction(key: Key) {
							switch (key) {
								case "edit": {
									setAction({ kind: "edit", item: row });
									break;
								}
							}
						}

						return (
							<Row>
								<Cell>{row.person.name}</Cell>
								<Cell>{row.role.name}</Cell>
								<Cell>{row.workingGroup?.name}</Cell>
								<Cell>{row.country?.name}</Cell>
								<Cell>{row.startDate != null ? dateTime(row.startDate) : undefined}</Cell>
								<Cell>{row.endDate != null ? dateTime(row.endDate) : undefined}</Cell>
								<Cell>
									<div className="flex justify-end">
										<DropdownMenuTrigger>
											<IconButton className="mx-auto" variant="plain">
												<MoreHorizontalIcon aria-hidden={true} className="size-5 shrink-0" />
												<span className="sr-only">Menu</span>
											</IconButton>
											<DropdownMenu onAction={onAction} placement="bottom">
												<DropdownMenuItem id="edit">
													Edit
													<PencilIcon aria-hidden={true} className="size-4 shrink-0" />
												</DropdownMenuItem>
												<DropdownMenuItem id="delete">
													Delete
													<Trash2Icon aria-hidden={true} className="size-4 shrink-0" />
												</DropdownMenuItem>
											</DropdownMenu>
										</DropdownMenuTrigger>
									</div>
								</Cell>
							</Row>
						);
					}}
				</TableBody>
			</Table>

			<div className="flex justify-end">
				<Pagination pagination={pagination} />
			</div>

			<CreateContributionDialog
				key={createKey("create-contribution", action?.item?.id)}
				action={action}
				countriesById={countriesById}
				onClose={onDialogClose}
				personsById={personsById}
				rolesById={rolesById}
				workingGroupsById={workingGroupsById}
			/>
			<EditContributionDialog
				key={createKey("edit-contribution", action?.item?.id)}
				action={action}
				countriesById={countriesById}
				onClose={onDialogClose}
				personsById={personsById}
				rolesById={rolesById}
				workingGroupsById={workingGroupsById}
			/>
		</Fragment>
	);
}

interface CreateContributionDialogProps {
	action: Action | null;
	countriesById: Map<Country["id"], Country>;
	personsById: Map<Person["id"], Person>;
	rolesById: Map<Role["id"], Pick<Role, "id" | "name" | "type">>;
	workingGroupsById: Map<WorkingGroup["id"], WorkingGroup>;
	onClose: () => void;
}

function CreateContributionDialog(props: CreateContributionDialogProps) {
	const { action, countriesById, personsById, rolesById, workingGroupsById, onClose } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(createContributionAction, undefined);

	if (action?.kind !== "create") return null;

	const contribution = action.item;

	return (
		<ModalOverlay isOpen={true} onOpenChange={onClose}>
			<Modal isOpen={true} onOpenChange={onClose}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Create contribution</DialogTitle>
									<DialogDescription>Please provide contribution details.</DialogDescription>
								</DialogHeader>

								<div>
									<ContributionEditForm
										contribution={contribution}
										countriesById={countriesById}
										formAction={formAction}
										formId={formId}
										formState={formState}
										onClose={close}
										personsById={personsById}
										rolesById={rolesById}
										workingGroupsById={workingGroupsById}
									/>
								</div>

								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<SubmitButton form={formId}>Create</SubmitButton>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}

interface EditContributionDialogProps {
	action: Action | null;
	countriesById: Map<Country["id"], Country>;
	personsById: Map<Person["id"], Person>;
	rolesById: Map<Role["id"], Pick<Role, "id" | "name" | "type">>;
	workingGroupsById: Map<WorkingGroup["id"], WorkingGroup>;
	onClose: () => void;
}

function EditContributionDialog(props: EditContributionDialogProps) {
	const { action, countriesById, personsById, rolesById, workingGroupsById, onClose } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(updateContributionAction, undefined);

	if (action?.kind !== "edit") return null;

	const contribution = action.item;

	return (
		<ModalOverlay isOpen={true} onOpenChange={onClose}>
			<Modal isOpen={true} onOpenChange={onClose}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Update contribution</DialogTitle>
									<DialogDescription>Please provide contribution details.</DialogDescription>
								</DialogHeader>

								<div>
									<ContributionEditForm
										contribution={contribution}
										countriesById={countriesById}
										formAction={formAction}
										formId={formId}
										formState={formState}
										onClose={close}
										personsById={personsById}
										rolesById={rolesById}
										workingGroupsById={workingGroupsById}
									/>
								</div>

								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<SubmitButton form={formId}>Update</SubmitButton>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}

interface ContributionEditFormProps {
	countriesById: Map<Country["id"], Country>;
	personsById: Map<Person["id"], Person>;
	rolesById: Map<Role["id"], Pick<Role, "id" | "name" | "type">>;
	workingGroupsById: Map<WorkingGroup["id"], WorkingGroup>;
	formId: string;
	formAction: (formData: FormData) => void;
	formState: Awaited<ReturnType<typeof createContributionAction>> | undefined;
	contribution: Prisma.ContributionGetPayload<{
		include: {
			person: { select: { id: true } };
			role: { select: { id: true } };
			workingGroup: { select: { id: true } };
			country: { select: { id: true } };
		};
	}> | null;
	onClose: () => void;
}

function ContributionEditForm(props: ContributionEditFormProps) {
	const {
		countriesById,
		personsById,
		rolesById,
		workingGroupsById,
		formId,
		formAction,
		formState,
		contribution,
		onClose,
	} = props;

	const [selectedRoleId, setSelectedRowId] = useState(contribution?.roleId);
	const selectedRole = useMemo(() => {
		return selectedRoleId ? rolesById.get(selectedRoleId) : undefined;
	}, [rolesById, selectedRoleId]);

	return (
		<Form
			action={(formData) => {
				formAction(formData);
				onClose();
			}}
			className="grid gap-y-6"
			id={formId}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			{contribution != null ? <input name="id" type="hidden" value={contribution.id} /> : null}

			<SelectField
				defaultSelectedKey={contribution?.personId}
				isRequired={true}
				label="Person"
				name="personId"
			>
				{Array.from(personsById.values()).map((person) => {
					return (
						<SelectItem key={person.id} id={person.id} textValue={person.name}>
							{person.name}
						</SelectItem>
					);
				})}
			</SelectField>

			<SelectField
				isRequired={true}
				label="Role"
				name="roleId"
				onSelectionChange={(key) => {
					setSelectedRowId(key as string);
				}}
				selectedKey={selectedRoleId ?? null}
			>
				{Array.from(rolesById.values()).map((role) => {
					return (
						<SelectItem key={role.id} id={role.id} textValue={role.name}>
							{role.name}
						</SelectItem>
					);
				})}
			</SelectField>

			<SelectField
				defaultSelectedKey={contribution?.workingGroup?.id}
				isDisabled={selectedRole == null || !["wg_chair", "wg_member"].includes(selectedRole.type)}
				isRequired={selectedRole != null && ["wg_chair", "wg_member"].includes(selectedRole.type)}
				label="Working Group"
				name="workingGroupId"
			>
				{Array.from(workingGroupsById.values()).map((workingGroup) => {
					return (
						<SelectItem key={workingGroup.id} id={workingGroup.id} textValue={workingGroup.name}>
							{workingGroup.name}
						</SelectItem>
					);
				})}
			</SelectField>

			<SelectField
				defaultSelectedKey={contribution?.country?.id}
				isClearable={true}
				label="Country"
				name="countryId"
			>
				{Array.from(countriesById.values()).map((country) => {
					return (
						<SelectItem key={country.id} id={country.id} textValue={country.name}>
							{country.name}
						</SelectItem>
					);
				})}
			</SelectField>

			<DateInputField
				defaultValue={
					contribution?.startDate ? toDateValue(contribution.startDate.toISOString()) : undefined
				}
				granularity="day"
				// isRequired={true}
				label="Start date"
				name="startDate"
			/>

			<DateInputField
				defaultValue={contribution?.endDate ? toDateValue(contribution.endDate) : undefined}
				granularity="day"
				label="End date"
				name="endDate"
			/>

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
