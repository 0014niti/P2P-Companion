import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchGateio = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
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
        // USE YOUR PRIVATE CLOUDFLARE PROXY
		const proxyUrl = `https://p2p-proxy.bossbuzy0.workers.dev/?url=${encodeURIComponent(targetUrl)}`;
		const res = await fetch(proxyUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: bodyPayload
		});

		if (res.ok) {
			const text = await res.text();
			try { data = JSON.parse(text); } catch (e) { /* Safely ignore */ }
		}
	} catch (e) {
		console.error('Gate.io private proxy failed:', e);
	}

	let rawList: any[] = [];
	if (Array.isArray(data?.data)) rawList = data.data;
	else if (Array.isArray(data?.data?.list)) rawList = data.data.list;
	else if (Array.isArray(data?.data?.advs)) rawList = data.data.advs;
	else if (Array.isArray(data?.list)) rawList = data.list;
	else if (data) {
		const found = Object.values(data).find(val => Array.isArray(val));
		if (found) rawList = found;
	}

	if (!Array.isArray(rawList) || rawList.length === 0) return [];

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
		isNewUserOnly: checkIsNewUserOnly(item)
	})) as ExchangeP2PAd[];
};
