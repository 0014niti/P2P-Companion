import type { ExchangeP2PAd } from '.';

export const fetchGateio = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// Gate.io uses 'sell' ads to fulfill a user's 'buy' request
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	
	const targetUrl = `https://www.gate.io/json_cmp/c2c/pushTradeAds?fiat=${props.fiat.toUpperCase()}&coin=${props.token.toUpperCase()}&type=${tradeType}&page=1&t=${Date.now()}`;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: { code?: number; data?: { list?: Record<string, any>[] } } | null = null;

	try {
		// Method 1: Use AllOrigins GET wrapper to bypass Cloudflare
		const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
		const res = await fetch(proxyUrl);
		const proxyResponse = await res.json();
		
		if (proxyResponse?.contents) {
			data = JSON.parse(proxyResponse.contents);
		}
	} catch (e) {
		console.error('Gate.io Proxy fetch failed:', e);
	}

	// Method 2: Fallback to direct fetch
	if (!data) {
		try {
			const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
			const res = await fetch(targetUrl, { headers, method: 'GET' });
			if (res.ok) {
				data = await res.json();
			}
		} catch (e) {
			console.error('Gate.io direct fetch fallback failed:', e);
		}
	}

	if (!data || !data.data || !data.data.list) {
		return [];
	}

	return data.data.list.map((item) => ({
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