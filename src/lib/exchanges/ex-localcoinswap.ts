import { type ExchangeP2PAd } from '.';

export const fetchLocalCoinSwap = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// If user wants to BUY crypto, we search for SELL offers (makers selling).
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	const url = `https://localcoinswap.com/api/v2/offers-search/?buy_or_sell=${tradeType}&coin=${props.token.toUpperCase()}&fiat=${props.fiat.toUpperCase()}`;

	const res = await fetch(url, {
		headers: { 
			'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
		}
	});

	if (!res.ok) throw new Error(`LocalCoinSwap API failed (HTTP ${res.status})`);
	
	const data = await res.json();
	if (!data.results || !Array.isArray(data.results)) return [];

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