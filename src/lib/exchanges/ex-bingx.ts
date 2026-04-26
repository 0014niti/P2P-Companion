import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchBingx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const tradeType = props.type === 'buy' ? 'SELL' : 'BUY';
	const targetUrl = 'https://bingx.com/api/v3/p2p/adv/search';
	
	const bodyPayload = JSON.stringify({
		fiat: props.fiat.toUpperCase(),
		asset: props.token.toUpperCase(),
		tradeType: tradeType,
		page: 1,
		limit: 10
	});

	// The Triple-Threat Proxy Rotation
	const proxies = [
		(url: string) => `https://p2p-proxy.bossbuzy0.workers.dev/?url=${encodeURIComponent(url)}`,
		(url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
		(url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: Record<string, any> | null = null;

	for (const proxyFactory of proxies) {
		try {
			const proxyUrl = proxyFactory(targetUrl);
			const res = await fetch(proxyUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: bodyPayload
			});
			
			if (res.ok) {
				const text = await res.text();
				try { 
					data = JSON.parse(text); 
					if (data && data.data) break; // Success! Break the loop
				} catch (e) { 
					// Print the exact WAF Firewall block so we can see it
					console.warn(`BingX Proxy Blocked. Response preview:`, text.substring(0, 150)); 
				}
			}
		} catch (e) {
			console.warn('BingX proxy failed, rotating...');
		}
	}

	const rawList = Array.isArray(data?.data) ? data.data : (data?.data?.list || data?.data?.advList || data?.list || []);

	if (!Array.isArray(rawList) || rawList.length === 0) return [];

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
		},
		terms: extractTerms(item),
		isNewUserOnly: checkIsNewUserOnly(item)
	})) as ExchangeP2PAd[];
};
