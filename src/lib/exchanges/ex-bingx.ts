import type { ExchangeP2PAd } from '.';

export const fetchBingx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// BingX uses 'SELL' ads to fulfill a user's 'buy' request
	const tradeType = props.type === 'buy' ? 'SELL' : 'BUY';
	
	const targetUrl = `https://bingx.com/api/v3/p2p/adv/search?fiat=${props.fiat.toUpperCase()}&asset=${props.token.toUpperCase()}&tradeType=${tradeType}&page=1&limit=10&t=${Date.now()}`;

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
		console.error('BingX Proxy fetch failed:', e);
	}

	// Method 2: Fallback to direct fetch
	if (!data || data.code !== 0) {
		try {
			const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
			const res = await fetch(targetUrl, { headers, method: 'GET' });
			if (res.ok) {
				data = await res.json();
			}
		} catch (e) {
			console.error('BingX direct fetch fallback failed:', e);
		}
	}

	if (!data || !data.data || !data.data.list) {
		return [];
	}

	return data.data.list.map((item) => ({
		advNo: item.advId?.toString() || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price || '0',
		surplusAmount: item.surplusAmount || '0',
		tradableQuantity: item.tradableQuantity || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.minAmount || '0',
		maxSingleTransAmount: item.maxAmount || '0',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.payMethods ? item.payMethods.map((method: any) => ({
			type: method.methodName || 'Bank',
			identifier: method.methodId?.toString() || 'unknown',
			name: method.methodName || 'Bank Transfer'
		})) : [],
		advertiser: {
			name: item.nickName || 'Unknown',
			userId: item.userId?.toString() || '',
			monthOrderCount: item.monthOrderCount || 0,
			positiveRate: item.positiveRate || 0
		}
	})) as ExchangeP2PAd[];
};