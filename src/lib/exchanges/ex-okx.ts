import type { ExchangeP2PAd } from '.';

export const fetchOkx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const res = await fetch(
		`https://www.okx.com/v3/c2c/tradingOrders/getMarketplaceAdsPrelogin?side=${props.type === 'buy' ? 'sell' : 'buy'}&paymentMethod=all&userType=all&sortType=${props.type === 'buy' ? 'price_asc' : 'price_desc'}&limit=100&cryptoCurrency=${props.token.toUpperCase()}&fiatCurrency=${props.fiat.toUpperCase()}&currentPage=1&numberPerPage=5&t=${Date.now()}`,
		{
			method: 'GET'
		}
	);

	if (!res.ok) {
		throw new Error(`Error fetching OKX data: ${res.status} ${res.statusText}`);
	}

	const data = (await res.json()) as {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: { sell: Record<string, any>[]; buy: Record<string, any>[] };
	};

	return data.data[props.type === 'buy' ? 'sell' : 'buy'].map((item) => ({
		advNo: item.id,
		tradeType: item.side.toUpperCase(),
		asset: item.baseCurrency.toUpperCase(),
		fiatUnit: item.quoteCurrency.toUpperCase(),
		price: item.price,
		surplusAmount: item.availableAmount,
		tradableQuantity: item.availableAmount,
		fiatSymbol: item.quoteSymbol,
		minSingleTransAmount: item.quoteMaxAmountPerOrder,
		maxSingleTransAmount: item.quoteMinAmountPerOrder,
		paymentMethods: item.paymentMethods.map((method: string) => ({
			type: method,
			identifier: method,
			name: method === 'bank' ? 'Bank' : method,
			bgColor: null
		})),
		advertiser: {
			name: item.nickName,
			userId: item.merchantId,
			monthOrderCount: item.completedOrderQuantity,
			positiveRate: item.completedRate
		}
	})) as ExchangeP2PAd[];
};
