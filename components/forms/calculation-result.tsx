import { getFormatter } from "next-intl/server";

import { Link } from "@/components/link";
import { createHref } from "@/lib/navigation/create-href";

interface CalculationResultProperties {
	isAboveThreshold: boolean;
	operationalCostThreshold: number;
	operationalCost: number;
	successMessage: string;
	userEmail?: string;
}

export async function CalculationResult(props: CalculationResultProperties) {
	const { isAboveThreshold, operationalCostThreshold, operationalCost, successMessage, userEmail } =
		props;

	const format = await getFormatter();

	return (
		<>
			<div className="grid gap-y-2 text-sm text-neutral-950 dark:text-neutral-0">
				<div>Financial value of the national in-kind contribution:</div>
				<div>
					Threshold:{" "}
					{format.number(operationalCostThreshold, {
						style: "currency",
						currency: "EUR",
					})}
				</div>
				<div>
					Cost calculation:{" "}
					{format.number(operationalCost, {
						style: "currency",
						currency: "EUR",
					})}
				</div>
			</div>
			{!isAboveThreshold ? (
				<div>
					Using the Policy on InKind Financial Value calculations, you have not reached the
					threshold. This is not necessarily problematic, as you can report your own figures. Please
					get in touch with the DARIAH team via our{" "}
					<Link
						href={createHref({
							pathname: "/contact",
							searchParams: {
								email: userEmail,
								subject: "Operational cost calculation",
							},
						})}
					>
						contact form
					</Link>
					.
				</div>
			) : (
				<div>{successMessage}</div>
			)}
		</>
	);
}
