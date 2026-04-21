import { extractTerms, checkIsRestricted, type ExchangeP2PAd } from '.';

export const fetchKucoin = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// KuCoin P2P API uses 'SELL' ads to fulfill a user's 'buy' request
	const side = props.type === 'buy' ? 'SELL' : 'BUY';
	const url = `https://www.kucoin.com/_api/otc/ad/list?currency=${props.token.toUpperCase()}&legal=${props.fiat.toUpperCase()}&page=1&pageSize=10&side=${side}`;

	const res = await fetch(url, {
		headers: {
			'accept': 'application/json',
			'content-type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'Origin': 'https://www.kucoin.com',
			'Referer': 'https://www.kucoin.com/'
		},
		method: 'GET'
	});

	if (!res.ok) {
		throw new Error(`Error fetching KuCoin data: ${res.status} ${res.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.json()) as { items?: Record<string, any>[], data?: { items?: Record<string, any>[] } };
	const items = data?.items || data?.data?.items;

	if (!items) {
		return [];
	}

	return items.map((item) => ({
		advNo: item.id?.toString() || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: item.currency || props.token.toUpperCase(),
		fiatUnit: item.legal || props.fiat.toUpperCase(),
		price: item.floatPrice || item.premium || '0',
		surplusAmount: item.currencyQuantity || '0',
		tradableQuantity: item.currencyQuantity || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.limitMinQuote || '0',
		maxSingleTransAmount: item.limitMaxQuote || '0',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.adPayTypes ? item.adPayTypes.map((method: any) => ({
			type: method.payTypeCode || 'Bank',
			identifier: method.payTypeCode || 'unknown',
			name: method.payTypeName || 'Bank Transfer'
		})) : [],
		advertiser: {
			name: item.nickName || 'Unknown',
			userId: item.userId || '',
			monthOrderCount: item.dealCount || 0,
			positiveRate: (item.dealRate || 0) * 100
		},
		terms: extractTerms(item),
		isRestricted: checkIsRestricted(item)
	})) as ExchangeP2PAd[];
};