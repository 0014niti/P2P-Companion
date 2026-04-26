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

    // USING THE GOOGLE APPS SCRIPT PROXY
	const gasProxyUrl = `https://script.google.com/macros/s/AKfycbw-7r2WzIt0NCrtnKtcEizu_16-vJ8rX9xCFL-5HpvckL7Rab3ojYuAit8jkivrxAEW/exec?url=${encodeURIComponent(targetUrl)}&contentType=application/json&body=${encodeURIComponent(bodyPayload)}`;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: Record<string, any> | null = null;

    try {
        const res = await fetch(gasProxyUrl);
        if (res.ok) {
            const text = await res.text();
            try { 
                data = JSON.parse(text); 
            } catch (e) { 
                console.warn(`BingX Proxy Blocked:`, text.substring(0, 100)); 
            }
        }
    } catch (e) {
        console.error('BingX Google proxy failed:', e);
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
