import { extractTerms, checkIsRestricted, type ExchangeP2PAd } from '.';

export const fetchGateio = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// Gate.io uses 'sell' ads to fulfill a user's 'buy' request
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	
	const targetUrl = 'https://www.gate.io/json_cmp/c2c/pushTradeAds';
	const bodyPayload = new URLSearchParams({
		fiat: props.fiat.toUpperCase(),
		coin: props.token.toUpperCase(),
		type: tradeType,
		amount: '',
		pay_type: '',
		page: '1'
	}).toString();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: Record<string, any> | null = null;

	try {
		// Method 1: Direct fetch with the crucial 'X-Requested-With' AJAX header
		const res = await fetch(targetUrl, {
			headers: {
				'accept': 'application/json, text/plain, */*',
				'accept-language': 'en-US,en;q=0.9',
				'content-type': 'application/x-www-form-urlencoded',
				'X-Requested-With': 'XMLHttpRequest',
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
			body: bodyPayload,
			method: 'POST'
		});

		if (res.ok) {
			const text = await res.text();
			try { data = JSON.parse(text); } catch (e) { /* Ignore HTML Cloudflare blocks */ }
		}
	} catch (e) {
		console.error('Gate.io direct fetch failed:', e);
	}

	// Method 2: Proxy fallback using api.codetabs.com
	if (!data || (!data.data && !data.list)) {
		try {
			const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
			const proxyRes = await fetch(proxyUrl, {
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'X-Requested-With': 'XMLHttpRequest',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				},
				body: bodyPayload,
				method: 'POST'
			});
			
			if (proxyRes.ok) {
				const text = await proxyRes.text();
				try { data = JSON.parse(text); } catch (e) { /* Ignore HTML Cloudflare blocks */ }
			}
		} catch (e) {
			console.error('Gate.io proxy fetch failed:', e);
		}
	}

	// Deep array extraction: Find the first array in the response object regardless of the key name
	let rawList: any[] = [];
	if (Array.isArray(data?.data)) rawList = data.data;
	else if (Array.isArray(data?.data?.list)) rawList = data.data.list;
	else if (Array.isArray(data?.data?.advs)) rawList = data.data.advs;
	else if (Array.isArray(data?.list)) rawList = data.list;
	else if (data) {
		const found = Object.values(data).find(val => Array.isArray(val));
		if (found) rawList = found;
	}

	if (!Array.isArray(rawList) || rawList.length === 0) {
		return [];
	}

	return rawList.map((item) => ({
		advNo: item.adv_id?.toString() || item.id?.toString() || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price || item.rate || '0',
		surplusAmount: item.amount || item.remain_amount || '0',
		tradableQuantity: item.amount || item.remain_amount || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.min_amount || item.min_order_amount || '0',
		maxSingleTransAmount: item.max_amount || item.max_order_amount || '0',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: (item.pay_methods || item.payments || []).map((method: any) => ({
			type: method.name || method.type || 'Bank',
			identifier: method.id?.toString() || 'unknown',
			name: method.name || 'Bank Transfer'
		})),
		advertiser: {
			name: item.merchant_name || item.nickname || 'Unknown',
			userId: item.merchant_id?.toString() || item.uid?.toString() || '',
			monthOrderCount: item.trade_count || item.month_order_count || 0,
			positiveRate: item.completion_rate || item.complete_rate || 0
		},
		terms: extractTerms(item),
		isRestricted: checkIsRestricted(item)
	})) as ExchangeP2PAd[];
};