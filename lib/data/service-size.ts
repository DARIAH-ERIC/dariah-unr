interface GetServiceSizeThresholdsForYearParams {
	year: number;
}

export async function getServiceSizeThresholdsForYear(
	_params: GetServiceSizeThresholdsForYearParams,
) {
	const thresholds = {
		small: 7_000,
		large: 170_000,
	};

	return Promise.resolve(thresholds);
}
