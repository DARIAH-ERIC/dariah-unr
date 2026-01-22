import { v7 as uuidv7 } from "uuid";
import type * as v from "valibot";

export type ValidationErrors = Record<string, string | Array<string>>;

interface ActionStateBase {
	status: "initial" | "success" | "error";
	id: string;
	formData?: FormData | undefined;
}

export interface ActionStateInitial extends ActionStateBase {
	status: "initial";
}

export interface ActionStateSuccess<TData = unknown> extends ActionStateBase {
	status: "success";
	message?: string | Array<string> | undefined;
	data: TData;
}

export interface ActionStateError<
	TValidationErrors extends ValidationErrors = ValidationErrors,
> extends ActionStateBase {
	status: "error";
	message?: string | Array<string> | undefined;
	validationErrors?: TValidationErrors | undefined;
}

export type ActionState<
	TData = unknown,
	TValidationErrors extends ValidationErrors = ValidationErrors,
> = ActionStateInitial | ActionStateSuccess<TData> | ActionStateError<TValidationErrors>;

export function createActionStateInitial(params?: {
	formData?: FormData | undefined;
}): ActionStateInitial {
	return {
		status: "initial",
		id: "initial",
		formData: params?.formData,
	};
}

export function createActionStateSuccess(params: {
	formData?: FormData | undefined;
	message?: string | Array<string> | undefined;
}): ActionStateSuccess<void>;
export function createActionStateSuccess<TData = unknown>(params: {
	data: TData;
	formData?: FormData | undefined;
	message?: string | Array<string> | undefined;
}): ActionStateSuccess<TData>;
export function createActionStateSuccess<TData = unknown>(params: {
	data?: TData;
	formData?: FormData | undefined;
	message?: string | Array<string> | undefined;
}): ActionStateSuccess<TData | undefined> {
	return {
		status: "success",
		id: uuidv7(),
		formData: params.formData,
		message: params.message,
		data: params.data,
	};
}

export function createActionStateError<
	TValidationErrors extends ValidationErrors = ValidationErrors,
>(params: {
	formData?: FormData | undefined;
	message?: string | Array<string> | undefined;
	validationErrors?: TValidationErrors | undefined;
}): ActionStateError<TValidationErrors> {
	return {
		status: "error",
		id: uuidv7(),
		formData: params.formData,
		message: params.message,
		validationErrors: params.validationErrors,
	};
}

export function isActionStateInitial<
	TData = unknown,
	TValidationErrors extends ValidationErrors = ValidationErrors,
>(state: ActionState<TData, TValidationErrors>): state is ActionStateInitial {
	return state.status === "initial";
}

export function isActionStateSuccess<
	TData = unknown,
	TValidationErrors extends ValidationErrors = ValidationErrors,
>(state: ActionState<TData, TValidationErrors>): state is ActionStateSuccess<TData> {
	return state.status === "success";
}

export function isActionStateError<
	TData = unknown,
	TValidationErrors extends ValidationErrors = ValidationErrors,
>(state: ActionState<TData, TValidationErrors>): state is ActionStateError<TValidationErrors> {
	return state.status === "error";
}

export type GetValidationErrors<TValidationSchema extends v.GenericSchema> = NonNullable<
	v.FlatErrors<TValidationSchema>["nested"]
>;
