import { extractTerms, type ExchangeP2PAd } from '.';

export const fetchPaxful = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	const targetUrl = 'https://paxful.com/data/offers';

	const payload = {
		cryptoCurrencyCode: props.token.toUpperCase(),
		fiatCurrencyCode: props.fiat.toUpperCase(),
		offerType: tradeType,
		hasMargin: false
	};

	try {
		const res = await fetch(targetUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				'Origin': 'https://paxful.com',
				'Referer': 'https://paxful.com/'
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) return [];
		const data = await res.json();
		
		const offers = data.data || data || [];
		if (!Array.isArray(offers) || offers.length === 0) return [];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return offers.map((item: any) => ({
			advNo: item.id?.toString() || item.offerId?.toString() || Math.random().toString(),
			tradeType: props.type.toUpperCase(),
			asset: props.token.toUpperCase(),
			fiatUnit: props.fiat.toUpperCase(),
			price: item.fiatPricePerCrypto?.toString() || item.price?.toString() || '0',
			surplusAmount: item.cryptoAmount?.toString() || '0',
			tradableQuantity: item.cryptoAmount?.toString() || '0',
			fiatSymbol: props.fiat.toUpperCase(),
			minSingleTransAmount: item.fiatAmountMin?.toString() || '0',
			maxSingleTransAmount: item.fiatAmountMax?.toString() || '0',
			paymentMethods: [{
				type: item.paymentMethodName || 'Bank',
				identifier: item.paymentMethodId?.toString() || 'unknown',
				name: item.paymentMethodName || 'Bank Transfer'
			}],
			advertiser: {
				name: item.vendorUsername || item.username || 'Unknown',
				userId: item.vendorId?.toString() || '',
				monthOrderCount: parseInt(item.vendorFeedbackPositive || '0', 10),
				positiveRate: 1 // Baseline assignment for active merchants
			},
			terms: item.offerTerms || extractTerms(item),
			isNewUserOnly: false
		})) as ExchangeP2PAd[];

	} catch (e) {
		console.warn('Paxful direct fetch failed:', e);
		return [];
	}
};