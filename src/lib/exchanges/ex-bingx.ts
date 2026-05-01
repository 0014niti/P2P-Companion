import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchBingx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// Swap type mapping to align with BingX API expectations
	const tradeType = props.type.toUpperCase();
	const currentTimestamp = Date.now();
	
	const targetUrl = `https://bingx.com/api/v3/p2p/adv/search?timestamp=${currentTimestamp}&t=${currentTimestamp}`;
	const bodyPayload = JSON.stringify({
		fiat: props.fiat.toUpperCase(),
		asset: props.token.toUpperCase(),
		tradeType: tradeType,
		page: 1, limit: 20, timestamp: currentTimestamp
	});

	const res = await fetch(targetUrl, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
			'Accept': 'application/json, text/plain, */*',
			'Origin': 'https://bingx.com',
			'Referer': 'https://bingx.com/'
		},
		body: bodyPayload
	});
	
	if (!res.ok) throw new Error(`BingX Blocked (HTTP ${res.status})`);
	const data = await res.json();

	const rawList = Array.isArray(data?.data) ? data.data : (data?.data?.list || data?.data?.advList || data?.list || []);
	
	if (!Array.isArray(rawList) && data.code !== 0) throw new Error(`BingX API Error: ${JSON.stringify(data).substring(0, 50)}`);
	if (!Array.isArray(rawList) || rawList.length === 0) {
		throw new Error(`BingX: 0 ads. Raw response: Code ${data.code}`);
	}

	return rawList.map((item) => {
		let positiveRate = parseFloat(item.positiveRate || '0');
		if (positiveRate > 1) positiveRate = positiveRate / 100;

		return {
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
			monthOrderCount: parseInt(item.monthOrderCount || '0', 10),
			positiveRate: positiveRate
		},
		terms: extractTerms(item),
		isNewUserOnly: checkIsNewUserOnly(item)
		};
	}) as ExchangeP2PAd[];
};
