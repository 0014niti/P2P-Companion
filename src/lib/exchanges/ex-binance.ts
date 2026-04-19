import type { ExchangeP2PAd } from '.';

export const fetchBinance = async (props: {
	type: 'buy' | 'sell';
	token: string;
	fiat: string;
}) => {
	const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
		headers: {
			c2ctype: 'c2c_web',
			clienttype: 'web',
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			fiat: props.fiat.toUpperCase(),
			page: 1,
			rows: 10,
			tradeType: props.type.toUpperCase(),
			asset: props.token.toUpperCase(),
			countries: [],
			proMerchantAds: false,
			shieldMerchantAds: false,
			filterType: 'all',
			periods: [],
			additionalKycVerifyFilter: 0,
			publisherType: null,
			payTypes: [],
			classifies: ['mass', 'profession', 'fiat_trade'],
			tradedWith: false,
			followed: false
		}),
		method: 'POST'
	});

	if (!res.ok) {
		throw new Error(`Error fetching Binance data: ${res.status} ${res.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.json()) as { data: Record<string, any>[] };

	return data.data.map((item) => ({
		advNo: item.adv.advNo,
		tradeType: item.adv.tradeType,
		asset: item.adv.asset,
		fiatUnit: item.adv.fiatUnit,
		price: item.adv.price,
		surplusAmount: item.adv.surplusAmount,
		tradableQuantity: item.adv.tradableQuantity,
		fiatSymbol: item.adv.fiatSymbol,
		minSingleTransAmount: item.adv.minSingleTransAmount,
		maxSingleTransAmount: item.adv.maxSingleTransAmount,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.adv.tradeMethods.map((method: Record<string, any>) => ({
			type: method.payType,
			identifier: method.identifier,
			name: method.tradeMethodName,
			bgColor: method.tradeMethodBgColor
		})),
		advertiser: {
			name: item.advertiser.nickName,
			userId: item.advertiser.userNo,
			monthOrderCount: item.advertiser.monthOrderCount,
			positiveRate: item.advertiser.monthFinishRate
		}
	})) as ExchangeP2PAd[];
};
