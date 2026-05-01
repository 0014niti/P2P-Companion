import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchGateio = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	const currentTimestamp = Date.now().toString();
	
	const targetUrl = `https://www.gate.io/json_cmp/c2c/pushTradeAds?t=${currentTimestamp}`;
	const bodyPayload = new URLSearchParams({
		fiat: props.fiat.toUpperCase(),
		coin: props.token.toUpperCase(),
		type: tradeType,
		amount: '', pay_type: '', page: '1', t: currentTimestamp
	}).toString();

	const res = await fetch(targetUrl, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
			'Accept': 'application/json, text/plain, */*',
			'Origin': 'https://www.gate.io',
			'Referer': 'https://www.gate.io/'
		},
		body: bodyPayload
	});
	
	if (!res.ok) throw new Error(`Gate.io Blocked (HTTP ${res.status})`);
	
	let data: any;
	try {
		data = await res.json();
	} catch (e) {
		throw new Error(`Gate.io returned invalid JSON (Possible Captcha)`);
	}

	let rawList: any[] = [];
	if (Array.isArray(data?.data)) rawList = data.data;
	else if (Array.isArray(data?.data?.list)) rawList = data.data.list;
	else if (Array.isArray(data?.data?.advs)) rawList = data.data.advs;
	else if (Array.isArray(data?.list)) rawList = data.list;

	if (!Array.isArray(rawList)) throw new Error(`Gate.io Parse Error: ${JSON.stringify(data).substring(0, 50)}`);
	if (rawList.length === 0) {
		throw new Error(`Gate.io: 0 ads. Raw response: ${JSON.stringify(data).substring(0, 60)}`);
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
		isNewUserOnly: checkIsNewUserOnly(item)
	})) as ExchangeP2PAd[];
};
