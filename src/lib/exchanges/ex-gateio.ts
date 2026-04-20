import type { ExchangeP2PAd } from '.';

export const fetchGateio = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// Gate.io uses 'sell' ads to fulfill a user's 'buy' request
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	
	const res = await fetch('https://www.gate.io/json_cmp/c2c/pushTradeAds', {
		headers: {
			'accept': 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'Origin': 'https://www.gate.io',
			'Referer': 'https://www.gate.io/p2p',
			'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'Sec-Ch-Ua-Mobile': '?0',
			'Sec-Ch-Ua-Platform': '"Windows"',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin'
		},
		body: new URLSearchParams({
			fiat: props.fiat.toUpperCase(),
			coin: props.token.toUpperCase(),
			type: tradeType,
			page: '1'
		}).toString(),
		method: 'POST'
	});

	if (!res.ok) {
		throw new Error(`Error fetching Gate.io data: ${res.status} ${res.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.json()) as Record<string, any>;

	const rawList = Array.isArray(data?.data) ? data.data : (data?.data?.list || data?.data?.advs || data?.list || []);

	if (!Array.isArray(rawList) || rawList.length === 0) {
		return [];
	}

	return rawList.map((item) => ({
		advNo: item.adv_id?.toString() || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price || '0',
		surplusAmount: item.amount || '0',
		tradableQuantity: item.amount || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.min_amount || '0',
		maxSingleTransAmount: item.max_amount || '0',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.pay_methods ? item.pay_methods.map((method: any) => ({
			type: method.name || 'Bank',
			identifier: method.id?.toString() || 'unknown',
			name: method.name || 'Bank Transfer'
		})) : [],
		advertiser: {
			name: item.merchant_name || 'Unknown',
			userId: item.merchant_id?.toString() || '',
			monthOrderCount: item.trade_count || 0,
			positiveRate: item.completion_rate || 0
		}
	})) as ExchangeP2PAd[];
};