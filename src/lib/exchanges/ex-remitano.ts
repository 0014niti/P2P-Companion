import { extractTerms, type ExchangeP2PAd } from '.';

export const fetchRemitano = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	// Remitano API logic: if a user wants to 'buy', we look for merchants offering to 'sell'
	const offerType = props.type === 'buy' ? 'sell' : 'buy';
	
	const targetUrl = `https://api.remitano.com/api/v1/offers/choose_offer_coins?coin=${props.token.toUpperCase()}&currency=${props.fiat.toUpperCase()}&offer_type=${offerType}`;

	try {
		const res = await fetch(targetUrl, {
			headers: { 
				'Accept': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
			}
		});
		
		if (!res.ok) return [];
		const data = await res.json();
		
		const offers = data.offers || data || [];
		if (!Array.isArray(offers) || offers.length === 0) return [];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return offers.map((item: any) => ({
			advNo: item.id?.toString() || Math.random().toString(),
			tradeType: props.type.toUpperCase(),
			asset: props.token.toUpperCase(),
			fiatUnit: props.fiat.toUpperCase(),
			price: item.price?.toString() || '0',
			surplusAmount: item.amount?.toString() || item.max_amount?.toString() || '0',
			tradableQuantity: item.amount?.toString() || item.max_amount?.toString() || '0',
			fiatSymbol: props.fiat.toUpperCase(),
			minSingleTransAmount: item.min_amount?.toString() || '0',
			maxSingleTransAmount: item.max_amount?.toString() || '0',
			paymentMethods: [{
				type: item.payment_method || 'Bank Transfer',
				identifier: 'bank',
				name: item.payment_method || 'Bank Transfer'
			}],
			advertiser: {
				name: item.username || 'Unknown',
				userId: item.user_id?.toString() || '',
				monthOrderCount: item.seller_trades_count || item.buyer_trades_count || 10,
				positiveRate: 1 // Remitano handles trust via escrow natively
			},
			terms: item.details || extractTerms(item),
			isNewUserOnly: false
		})) as ExchangeP2PAd[];

	} catch (e) {
		console.warn('Remitano direct fetch failed:', e);
		return [];
	}
};