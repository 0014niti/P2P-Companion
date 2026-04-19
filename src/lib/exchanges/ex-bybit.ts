import type { ExchangeP2PAd } from '.';

export const fetchBybit = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const res = await fetch('https://api2.bybit.com/fiat/otc/item/online', {
		headers: {
			'accept': 'application/json',
			'content-type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'Origin': 'https://www.bybit.com',
			'Referer': 'https://www.bybit.com/'
		},
		body: JSON.stringify({
			userId: '',
			tokenId: props.token.toUpperCase(),
			currencyId: props.fiat.toUpperCase(),
			payment: [],
			side: props.type === 'buy' ? '1' : '0', // 1 usually means user buys, 0 means user sells
			size: '10',
			page: '1',
			amount: '',
			authMaker: false,
			canTrade: false
		}),
		method: 'POST'
	});

	if (!res.ok) {
		throw new Error(`Error fetching Bybit data: ${res.status} ${res.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.json()) as { result?: { items?: Record<string, any>[] } };

	if (!data?.result?.items) {
		return [];
	}

	return data.result.items.map((item) => ({
		advNo: item.id || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price,
		surplusAmount: item.lastQuantity || '0',
		tradableQuantity: item.lastQuantity || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.minAmount || '0',
		maxSingleTransAmount: item.maxAmount || '0',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.payTermDtos ? item.payTermDtos.map((method: any) => ({
			type: method.payName || 'Bank',
			identifier: method.payType || 'unknown',
			name: method.payName || 'Bank Transfer',
			bgColor: null
		})) : [],
		advertiser: {
			name: item.nickName || 'Unknown',
			userId: item.userId || '',
			monthOrderCount: item.recentOrderNum || 0,
			positiveRate: item.recentExecuteRate || 0
		}
	})) as ExchangeP2PAd[];
};