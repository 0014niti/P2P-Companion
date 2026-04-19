export const fetchUrlBuilder = (
	props: {
		type: 'buy' | 'sell';
		token: string;
		fiat: string;
	},
	exchange: string
) => {
	const searchParams = new URLSearchParams({
		type: props.type,
		token: props.token,
		fiat: props.fiat,
		exchange
	});

	return `/api?${searchParams.toString()}`;
};
