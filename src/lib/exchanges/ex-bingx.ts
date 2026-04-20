import type { ExchangeP2PAd } from '.';

export const fetchBingx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// BingX uses 'SELL' ads to fulfill a user's 'buy' request
	const tradeType = props.type === 'buy' ? 'SELL' : 'BUY';
	
	const targetUrl = 'https://bingx.com/api/v3/p2p/adv/search';

	const headers = {
		'accept': 'application/json, text/plain, */*',
		'accept-language': 'en-US,en;q=0.9',
		'content-type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
		'Origin': 'https://bingx.com',
		'Referer': 'https://bingx.com/en-us/p2p/',
		'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
		'Sec-Ch-Ua-Mobile': '?0',
		'Sec-Ch-Ua-Platform': '"Windows"',
		'Sec-Fetch-Dest': 'empty',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Site': 'same-origin'
	};

	const body = JSON.stringify({
		fiat: props.fiat.toUpperCase(),
		asset: props.token.toUpperCase(),
		tradeType: tradeType,
		page: 1,
		limit: 10
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: { code?: number; data?: { list?: Record<string, any>[] } } | null = null;

	try {
		// Method 1: Direct POST fetch
		const res = await fetch(targetUrl, { headers, body, method: 'POST' });
		if (res.ok) {
			data = await res.json();
		} else {
			// Method 2: Fallback to CORS proxy which supports POST
			const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
			const proxyRes = await fetch(proxyUrl, { headers, body, method: 'POST' });
			if (proxyRes.ok) {
				data = await proxyRes.json();
			}
		}
	} catch (e) {
		console.error('BingX fetch failed:', e);
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