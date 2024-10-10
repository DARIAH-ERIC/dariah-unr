import { assert, log } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

import { getCountryCodes } from "@/lib/get-country-codes";

const db = new PrismaClient();

async function createOperationalCostThresholds() {
	const countries = getCountryCodes();
	const operationalCostThresholds = getOperationalCostThresholds();

	for (const [_year, values] of Object.entries(operationalCostThresholds)) {
		const year = Number(_year);

		for (const [countryName, operationalCostThreshold] of Object.entries(values)) {
			const code = countries.get(countryName);
			assert(code);

			const country = await db.country.findFirst({
				where: {
					code,
				},
				select: {
					id: true,
				},
			});
			assert(country);

			await db.report.update({
				where: {
					countryId_year: {
						countryId: country.id,
						year,
					},
				},
				data: {
					operationalCostThreshold,
				},
			});
		}
	}
}

createOperationalCostThresholds()
	.then(() => {
		log.success("Successfully updated operational cost thresholds in the database.");
	})
	.catch((error: unknown) => {
		log.error("Failed to update operational cost thresholds in the database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		db.$disconnect().catch((error: unknown) => {
			log.error(String(error));
		});
	});

// ------------------------------------------------------------------------------------------------

function getOperationalCostThresholds() {
	const operationalCostThresholds = {
		2022: {
			Austria: 158_772,
			Belgium: 188_592,
			"Bosnia and Herzegovina": 7_254,
			Bulgaria: 22_567,
			Croatia: 20_955,
			Cyprus: 8_059,
			"Czech Republic": 82_207,
			Denmark: 125_728,
			France: 983_257,
			Germany: 1_406_379,
			Greece: 77_371,
			Ireland: 126_534,
			Italy: 739_860,
			Luxembourg: 23_372,
			Malta: 4_836,
			Netherlands: 315_932,
			Poland: 200_681,
			Portugal: 83_819,
			Serbia: 16_119,
			Slovenia: 18_537,
			Switzerland: 25_871,
		},
		2023: {
			Austria: 161_947,
			Belgium: 192_364,
			"Bosnia and Herzegovina": 7_399,
			Bulgaria: 23_018,
			Croatia: 21_374,
			Cyprus: 8_221,
			"Czech Republic": 83_851,
			Denmark: 128_242,
			France: 1_002_922,
			Germany: 1_434_507,
			Greece: 78_918,
			Ireland: 129_065,
			Italy: 754_658,
			Luxembourg: 23_840,
			Malta: 4_932,
			Netherlands: 322_250,
			Poland: 204_695,
			Portugal: 85_495,
			Serbia: 16_441,
			Slovenia: 18_908,
			Switzerland: 26_388,
		},
	};

	return operationalCostThresholds;
}
