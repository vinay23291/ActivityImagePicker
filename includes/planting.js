export const getSprayingTimingName = id => {
	const timings = {
	};

	return timings[ id ];
};

export const valueLabel = options => options.map( option => ( {
	label: option,
	value: option,
} ) );
