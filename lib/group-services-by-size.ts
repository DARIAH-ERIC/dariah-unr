import { groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import type { Prisma, Service } from "@prisma/client";

// FIXME: this needs to be moved to the database
// @see https://github.com/DARIAH-ERIC/dariah-unr/issues/143
const thresholds = {
	small: 7_000,
	large: 170_000,
};

export function groupServicesBySize(
	services: Array<Service>,
	serviceReports: Array<
		Prisma.ServiceReportGetPayload<{
			include: {
				service: true;
				kpis: true;
			};
		}>
	>,
) {
	const serviceReportsByServiceId = keyByToMap(serviceReports, (serviceReport) => {
		return serviceReport.service.id;
	});

	const servicesBySize = groupByToMap(services, (service) => {
		if (service.type === "core") return "core";

		const report = serviceReportsByServiceId.get(service.id);

		if (report == null) return "small";

		const visits = report.kpis.find((report) => {
			return report.unit === "visits";
		})?.value;

		if (visits == null) return "small";

		if (visits > thresholds.large) return "large";
		if (visits < thresholds.small) return "small";
		return "medium";
	});

	return servicesBySize;
}
