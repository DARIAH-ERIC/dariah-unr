"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import { type Country, type Prisma, UserRole } from "@prisma/client";
import { KeyRoundIcon, MoreHorizontalIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Fragment, type ReactNode, useActionState, useId, useMemo, useState } from "react";
import type { Key } from "react-aria-components";

import { Pagination } from "@/components/admin/pagination";
import { EMPTY_FILTER, useFilteredItems } from "@/components/admin/use-filtered-items";
import { usePagination } from "@/components/admin/use-pagination";
import { SubmitButton } from "@/components/submit-button";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
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
import {
	Cell,
	Column,
	Row,
	Table,
	TableBody,
	TableFilterSelect,
	TableHeader,
} from "@/components/ui/table";
import { createUserAction } from "@/lib/actions/admin/create-user";
import { deleteUserAction } from "@/lib/actions/admin/delete-user";
import { updateUserAction } from "@/lib/actions/admin/update-user";
import { updateUserPasswordAction } from "@/lib/actions/admin/update-user-password";
import { createKey } from "@/lib/create-key";

type Action =
	| {
			kind: "create";
			item: null;
	  }
	| {
			kind: "delete";
			item: Prisma.UserGetPayload<{
				include: {
					country: { select: { id: true } };
				};
			}>;
	  }
	| {
			kind: "edit";
			item: Prisma.UserGetPayload<{
				include: {
					country: { select: { id: true } };
				};
			}>;
	  }
	| {
			kind: "update-password";
			item: Prisma.UserGetPayload<{
				include: {
					country: { select: { id: true } };
				};
			}>;
	  };

interface AdminUsersTableContentProps {
	countries: Array<Country>;
	users: Array<
		Prisma.UserGetPayload<{
			include: { country: { select: { id: true } } };
		}>
	>;
}

export function AdminUsersTableContent(props: AdminUsersTableContentProps): ReactNode {
	const { countries, users } = props;

	const countriesById = useMemo(() => {
		return keyByToMap(countries, (country) => {
			return country.id;
		});
	}, [countries]);

	const [action, setAction] = useState<Action | null>(null);

	function onDialogClose() {
		setAction(null);
	}

	const [filteredItems, setCountryIdFilter] = useFilteredItems(users, (user, countryId) => {
		return user.countryId === countryId;
	});

	const [sortDescriptor, setSortDescriptor] = useState({
		column: "name" as "country" | "name" | "role",
		direction: "ascending" as "ascending" | "descending",
	});

	const items = useMemo(() => {
		const items = filteredItems.toSorted((a, z) => {
			switch (sortDescriptor.column) {
				case "country": {
					const idA = a.country?.id;
					const countryA = idA ? (countriesById.get(idA)?.name ?? "") : "";

					const idZ = z.country?.id;
					const countryZ = idZ ? (countriesById.get(idZ)?.name ?? "") : "";

					return countryA.localeCompare(countryZ);
				}

				default: {
					const valueA = a[sortDescriptor.column];
					const valueZ = z[sortDescriptor.column];

					return valueA.localeCompare(valueZ);
				}
			}
		});

		if (sortDescriptor.direction === "descending") {
			items.reverse();
		}

		return items;
	}, [sortDescriptor, filteredItems, countriesById]);

	const pagination = usePagination({ items });

	const countryFilterOptions = useMemo(() => {
		return [
			{ id: EMPTY_FILTER, label: "Show all" },
			...countries.map((country) => {
				return { id: country.id, label: country.name };
			}),
		];
	}, [countries]);

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
			<div className="flex justify-end">
				<TableFilterSelect
					defaultSelectedKey={EMPTY_FILTER}
					items={countryFilterOptions}
					label="Filter by Country"
					onSelectionChange={(key) => {
						setCountryIdFilter(String(key));
					}}
				/>
			</div>

			<Table
				aria-label="Users"
				className="w-full"
				// @ts-expect-error It's fine.
				onSortChange={setSortDescriptor}
				selectionMode="none"
				sortDescriptor={sortDescriptor}
			>
				<TableHeader>
					<Column allowsSorting={true} defaultWidth="2fr" id="name" isRowHeader={true}>
						Name
					</Column>
					<Column allowsSorting={true} id="country">
						Country
					</Column>
					<Column id="email">Email</Column>
					<Column allowsSorting={true} id="role">
						Role
					</Column>
					<Column defaultWidth={50} id="actions">
						Actions
					</Column>
				</TableHeader>
				<TableBody items={pagination.currentItems}>
					{(row) => {
						function onAction(key: Key) {
							switch (key) {
								case "delete": {
									setAction({ kind: "delete", item: row });
									break;
								}

								case "edit": {
									setAction({ kind: "edit", item: row });
									break;
								}

								case "update-password": {
									setAction({ kind: "update-password", item: row });
									break;
								}
							}
						}

						return (
							<Row>
								<Cell>
									<span title={row.name}>{row.name}</span>
								</Cell>
								<Cell>{row.country?.id ? countriesById.get(row.country.id)?.name : undefined}</Cell>
								<Cell>{row.email}</Cell>
								<Cell>{row.role}</Cell>
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
												<DropdownMenuItem id="update-password">
													Update password
													<KeyRoundIcon aria-hidden={true} className="size-4 shrink-0" />
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

			<CreateUserDialog
				key={createKey("create-user", action?.item?.id)}
				action={action}
				countriesById={countriesById}
				onClose={onDialogClose}
			/>
			<EditUserDialog
				key={createKey("edit-user", action?.item?.id)}
				action={action}
				countriesById={countriesById}
				onClose={onDialogClose}
			/>
			<UpdatePasswordDialog
				key={createKey("update-password", action?.item?.id)}
				action={action}
				onClose={onDialogClose}
			/>
			<DeleteUserDialog
				key={createKey("delete-user", action?.item?.id)}
				action={action}
				onClose={onDialogClose}
			/>
		</Fragment>
	);
}

interface DeleteUserDialogProps {
	action: Action | null;
	onClose: () => void;
}

function DeleteUserDialog(props: DeleteUserDialogProps) {
	const { action, onClose } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(deleteUserAction, undefined);

	if (action?.kind !== "delete") return null;

	return (
		<ModalOverlay isOpen={true} onOpenChange={onClose}>
			<Modal isOpen={true} onOpenChange={onClose}>
				<Dialog role="alertdialog">
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Delete user</DialogTitle>
									<DialogDescription>
										Are you sure you want to delete &quot;{action.item.name}&quot;?
									</DialogDescription>
								</DialogHeader>

								<div>
									<Form
										action={(formData) => {
											formAction(formData);
											close();
										}}
										className="grid gap-y-6"
										id={formId}
										validationErrors={
											formState?.status === "error" ? formState.fieldErrors : undefined
										}
									>
										<input name="id" type="hidden" value={action.item.id} />

										<FormSuccessMessage key={createKey("form-success", formState?.timestamp)}>
											{formState?.status === "success" && formState.message.length > 0
												? formState.message
												: null}
										</FormSuccessMessage>

										<FormErrorMessage key={createKey("form-error", formState?.timestamp)}>
											{formState?.status === "error" && formState.formErrors.length > 0
												? formState.formErrors
												: null}
										</FormErrorMessage>
									</Form>
								</div>

								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<SubmitButton form={formId}>Delete</SubmitButton>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}

interface CreateUserDialogProps {
	action: Action | null;
	countriesById: Map<Country["id"], Country>;
	onClose: () => void;
}

function CreateUserDialog(props: CreateUserDialogProps) {
	const { action, countriesById, onClose } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(createUserAction, undefined);

	if (action?.kind !== "create") return null;

	return (
		<ModalOverlay isOpen={true} onOpenChange={onClose}>
			<Modal isOpen={true} onOpenChange={onClose}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Create user</DialogTitle>
									<DialogDescription>Please provide user details.</DialogDescription>
								</DialogHeader>

								<div>
									<UserCreateForm
										countriesById={countriesById}
										formAction={formAction}
										formId={formId}
										formState={formState}
										onClose={close}
									/>
								</div>

								<p className="text-right text-sm text-orange-600 dark:text-orange-400">
									Make sure to copy the password &ndash; it will not be visible again!
								</p>

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

interface UserCreateFormProps {
	countriesById: Map<Country["id"], Country>;
	formId: string;
	formAction: (formData: FormData) => void;
	formState: Awaited<ReturnType<typeof createUserAction>> | undefined;
	onClose: () => void;
}

function UserCreateForm(props: UserCreateFormProps) {
	const { countriesById, formId, formAction, formState, onClose } = props;

	const userRoles = Object.values(UserRole);

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
			<TextInputField isRequired={true} label="Name" name="name" />

			<SelectField label="Country" name="country">
				{Array.from(countriesById.values()).map((country) => {
					return (
						<SelectItem key={country.id} id={country.id} textValue={country.name}>
							{country.name}
						</SelectItem>
					);
				})}
			</SelectField>

			<TextInputField isRequired={true} label="Email" name="email" type="email" />

			<PasswordGeneratorField />

			<SelectField isRequired={true} label="Role" name="role">
				{userRoles.map((role) => {
					return (
						<SelectItem key={role} id={role} textValue={role}>
							{role}
						</SelectItem>
					);
				})}
			</SelectField>

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

interface EditUserDialogProps {
	action: Action | null;
	countriesById: Map<Country["id"], Country>;
	onClose: () => void;
}

function EditUserDialog(props: EditUserDialogProps) {
	const { action, countriesById, onClose } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(updateUserAction, undefined);

	if (action?.kind !== "edit") return null;

	const user = action.item;

	return (
		<ModalOverlay isOpen={true} onOpenChange={onClose}>
			<Modal isOpen={true} onOpenChange={onClose}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Update user</DialogTitle>
									<DialogDescription>Please provide user details.</DialogDescription>
								</DialogHeader>

								<div>
									<UserEditForm
										countriesById={countriesById}
										formAction={formAction}
										formId={formId}
										formState={formState}
										onClose={close}
										user={user}
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

interface UserEditFormProps {
	countriesById: Map<Country["id"], Country>;
	formId: string;
	formAction: (formData: FormData) => void;
	formState: Awaited<ReturnType<typeof createUserAction>> | undefined;
	user: Prisma.UserGetPayload<{
		include: {
			country: { select: { id: true } };
		};
	}>;
	onClose: () => void;
}

function UserEditForm(props: UserEditFormProps) {
	const { countriesById, formId, formAction, formState, user, onClose } = props;

	const userRoles = Object.values(UserRole);

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
			<input name="id" type="hidden" value={user.id} />

			<TextInputField defaultValue={user.name} isRequired={true} label="Name" name="name" />

			<SelectField defaultSelectedKey={user.country?.id} label="Country" name="country">
				{Array.from(countriesById.values()).map((country) => {
					return (
						<SelectItem key={country.id} id={country.id} textValue={country.name}>
							{country.name}
						</SelectItem>
					);
				})}
			</SelectField>

			<TextInputField defaultValue={user.email} isReadOnly={true} label="Email" name="email" />

			<SelectField defaultSelectedKey={user.role} isRequired={true} label="Role" name="role">
				{userRoles.map((role) => {
					return (
						<SelectItem key={role} id={role} textValue={role}>
							{role}
						</SelectItem>
					);
				})}
			</SelectField>

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

interface UpdatePasswordDialogProps {
	action: Action | null;
	onClose: () => void;
}

function UpdatePasswordDialog(props: UpdatePasswordDialogProps) {
	const { action, onClose } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(updateUserPasswordAction, undefined);

	if (action?.kind !== "update-password") return null;

	const user = action.item;

	return (
		<ModalOverlay isOpen={true} onOpenChange={onClose}>
			<Modal isOpen={true} onOpenChange={onClose}>
				<Dialog role="alertdialog">
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Update password</DialogTitle>
									<DialogDescription>
										Replace the current user password with a newly generated one.
									</DialogDescription>
								</DialogHeader>

								<div>
									<Form
										action={(formData) => {
											formAction(formData);
											close();
										}}
										className="grid gap-y-6"
										id={formId}
										validationErrors={
											formState?.status === "error" ? formState.fieldErrors : undefined
										}
									>
										<input name="id" type="hidden" value={action.item.id} />

										<TextInputField
											defaultValue={user.email}
											isReadOnly={true}
											label="Email"
											name="email"
										/>

										<PasswordGeneratorField />

										<FormSuccessMessage key={createKey("form-success", formState?.timestamp)}>
											{formState?.status === "success" && formState.message.length > 0
												? formState.message
												: null}
										</FormSuccessMessage>

										<FormErrorMessage key={createKey("form-error", formState?.timestamp)}>
											{formState?.status === "error" && formState.formErrors.length > 0
												? formState.formErrors
												: null}
										</FormErrorMessage>
									</Form>
								</div>

								<p className="text-right text-sm text-orange-600 dark:text-orange-400">
									Make sure to copy the password &ndash; it will not be visible again!
								</p>

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

function PasswordGeneratorField(): ReactNode {
	const [generatedPassword, setGeneratedPassword] = useState(generatePassword);

	return (
		<div className="flex flex-col gap-y-1.5">
			<TextInputField
				isRequired={true}
				label="Password"
				name="password"
				value={generatedPassword}
			/>
			<Button
				onPress={() => {
					setGeneratedPassword(generatePassword());
				}}
			>
				Re-generate
			</Button>
		</div>
	);
}

function generatePassword(length = 16): string {
	const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const LOWER = "abcdefghijklmnopqrstuvwxyz";
	const DIGITS = "0123456789";
	const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/~";

	const ALL = UPPER + LOWER + DIGITS + SYMBOLS;

	const secureRandomBytes = (len: number): Uint8Array => {
		return crypto.getRandomValues(new Uint8Array(len));
	};

	const secureRandomInt = (max: number): number => {
		const limit = 256 - (256 % max);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			const b = secureRandomBytes(1)[0]!;

			if (b < limit) {
				return b % max;
			}
		}
	};

	const secureShuffle = (arr: Array<string>): Array<string> => {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = secureRandomInt(i + 1);

			[arr[i], arr[j]] = [arr[j]!, arr[i]!];
		}

		return arr;
	};

	if (length < 12) {
		throw new Error("Password length must be at least 12.");
	}

	/** Ensure at least one of each class. */
	const pwd = [
		UPPER[secureRandomInt(UPPER.length)]!,
		LOWER[secureRandomInt(LOWER.length)]!,
		DIGITS[secureRandomInt(DIGITS.length)]!,
		SYMBOLS[secureRandomInt(SYMBOLS.length)]!,
	];

	/** Fill the rest from full charset. */
	while (pwd.length < length) {
		pwd.push(ALL[secureRandomInt(ALL.length)]!);
	}

	return secureShuffle(pwd).join("");
}
