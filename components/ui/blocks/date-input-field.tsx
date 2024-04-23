import type { ReactNode } from "react";
import { DateSegment } from "react-aria-components";

import type { FieldProps } from "@/components/ui/blocks/field";
import { RequiredIndicator } from "@/components/ui/blocks/required-indicator";
import { DateField, type DateFieldProps, type DateValue } from "@/components/ui/date-field";
import { DateInput } from "@/components/ui/date-input";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";

interface DateInputFieldProps<T extends DateValue>
	extends Omit<DateFieldProps<T>, "children">,
		FieldProps {}

export function DateInputField<T extends DateValue>(props: DateInputFieldProps<T>): ReactNode {
	const { description, errorMessage, label, ...rest } = props;

	return (
		<DateField {...rest}>
			{label != null ? (
				<Label>
					{label}
					<RequiredIndicator isVisible={props.isRequired} />
				</Label>
			) : null}
			<DateInput>
				{(segment) => {
					return <DateSegment segment={segment} />;
				}}
			</DateInput>
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
		</DateField>
	);
}
