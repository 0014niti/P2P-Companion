import { type ExchangeP2PAd } from '.';

export const fetchLocalCoinSwap = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// If user wants to BUY crypto, we search for SELL offers (makers selling).
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	
	// Updated to the correct active endpoint
	const url = `https://localcoinswap.com/api/v2/offers/?buy_or_sell=${tradeType}&coin=${props.token.toUpperCase()}&fiat=${props.fiat.toUpperCase()}`;

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'accept': 'application/json',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json;charset=UTF-8',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'Referer': 'https://localcoinswap.com/',
			'Origin': 'https://localcoinswap.com',
			'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'Sec-Ch-Ua-Mobile': '?0',
			'Sec-Ch-Ua-Platform': '"Windows"',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin'
		}
	});

	if (!res.ok) throw new Error(`LocalCoinSwap Blocked (HTTP ${res.status})`);
	
	let data: any;
	try {
		data = await res.json();
	} catch (e) {
		throw new Error(`LocalCoinSwap returned invalid JSON (Possible Captcha)`);
	}

	if (!data.results || !Array.isArray(data.results)) {
		throw new Error(`LocalCoinSwap Parse Error: ${JSON.stringify(data).substring(0, 50)}`);
	}

	if (data.results.length === 0) {
		throw new Error(`LocalCoinSwap: 0 ads. Raw response: ${JSON.stringify(data).substring(0, 50)}`);
	}

	return data.results.map((item: any) => ({
		advNo: item.uuid || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price || '0',
		surplusAmount: item.max_amount || '0', 
		tradableQuantity: item.max_amount || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.min_amount || '0',
		maxSingleTransAmount: item.max_amount || '0',
		paymentMethods: item.payment_method ? [{ type: item.payment_method.name || 'Bank', identifier: item.payment_method.id?.toString() || 'unknown', name: item.payment_method.name || 'Bank Transfer' }] : [],
		advertiser: {
			name: item.user?.username || 'Unknown', userId: item.user?.uuid || '', monthOrderCount: item.user?.trade_count || 0,
			positiveRate: item.user?.feedback_score ? parseFloat(item.user.feedback_score) / 100 : 0
		},
		terms: item.terms || '', isNewUserOnly: false
	})) as ExchangeP2PAd[];
};