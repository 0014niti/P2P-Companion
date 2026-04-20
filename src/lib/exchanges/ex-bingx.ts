import type { ExchangeP2PAd } from '.';

export const fetchBingx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// BingX uses 'SELL' ads to fulfill a user's 'buy' request
	const tradeType = props.type === 'buy' ? 'SELL' : 'BUY';
	
	const targetUrl = 'https://bingx.com/api/v3/p2p/adv/search';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: Record<string, any> | null = null;

	try {
		// Method 1: Direct POST fetch
		const headers = {
			'accept': 'application/json',
			'content-type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
		};
		const body = JSON.stringify({
			fiat: props.fiat.toUpperCase(),
			asset: props.token.toUpperCase(),
			tradeType: tradeType,
			page: 1,
			limit: 10
		});
		const res = await fetch(targetUrl, { headers, body, method: 'POST' });
		if (res.ok) {
			data = await res.json();
		}
	} catch (e) {
		console.error('BingX fetch failed:', e);
	}

	// Method 2: Fallback to AllOrigins GET Proxy.
	// Many exchange APIs read both POST and GET params. This cleanly bypasses Cloudflare.
	if (!data || (!data.data && !data.list)) {
		try {
			const getUrl = `${targetUrl}?fiat=${props.fiat.toUpperCase()}&asset=${props.token.toUpperCase()}&tradeType=${tradeType}&page=1&limit=10&t=${Date.now()}`;
			const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(getUrl)}`;
			const res = await fetch(proxyUrl);
			const proxyData = await res.json();
			if (proxyData?.contents) data = JSON.parse(proxyData.contents);
		} catch (e) {
			console.error('BingX proxy fetch failed:', e);
		}
	}

	const rawList = Array.isArray(data?.data) ? data.data : (data?.data?.list || data?.data?.advList || data?.list || []);

	if (!Array.isArray(rawList) || rawList.length === 0) {
		return [];
	}

	return rawList.map((item) => ({
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