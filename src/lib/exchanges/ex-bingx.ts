import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchBingx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const tradeType = props.type === 'buy' ? 'SELL' : 'BUY';
	const currentTimestamp = Date.now();
	
	const targetUrl = `https://bingx.com/api/v3/p2p/adv/search?timestamp=${currentTimestamp}&t=${currentTimestamp}`;
	const bodyPayload = JSON.stringify({
		fiat: props.fiat.toUpperCase(),
		asset: props.token.toUpperCase(),
		tradeType: tradeType,
		page: 1,
		limit: 10,
		timestamp: currentTimestamp
	});

    // RESTORED TO CLOUDFLARE (Your browser in India will ping this!)
	const proxyUrl = `https://p2p-proxy.bossbuzy0.workers.dev/?url=${encodeURIComponent(targetUrl)}`;

	let data: Record<string, any> | null = null;

    try {
        const res = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: bodyPayload
        });
        if (res.ok) {
            const text = await res.text();
            try { data = JSON.parse(text); } catch (e) { console.warn("BingX Error:", text.substring(0,100)); }
        }
    } catch (e) {
        console.error('BingX proxy failed:', e);
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
