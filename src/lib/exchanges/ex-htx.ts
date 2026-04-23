import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

// HTX (Huobi) uses internal integer IDs for tokens and fiats instead of standard string codes.
const HTX_COINS: Record<string, string> = {
	USDT: '2',
	BTC: '1',
	ETH: '3',
	HT: '4',
	USDC: '69',
	TRX: '11'
};

const HTX_FIATS: Record<string, string> = {
	USD: '2',
	CNY: '1',
	EUR: '3',
	GBP: '4',
	VND: '14',
	PHP: '59',
	INR: '34',
	IDR: '13',
	RUB: '12',
	NGN: '60', // Added major P2P market
	BRL: '44', // Added major P2P market
	TRY: '57'  // Added major P2P market
};

export const fetchHtx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const coinId = HTX_COINS[props.token.toUpperCase()];
	const currencyId = HTX_FIATS[props.fiat.toUpperCase()];

	// If the token or fiat is not mapped above, we return empty as HTX won't recognize it
	if (!coinId || !currencyId) {
		return [];
	}

	// HTX side logic: user buys = 'sell' ad from merchant
	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	
	// Appended exact timestamp to prevent any browser/proxy caching
	const targetUrl = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=${coinId}&currency=${currencyId}&tradeType=${tradeType}&currPage=1&payMethod=0&acceptOrder=0&country=&blockType=general&online=1&range=0&amount=&t=${Date.now()}`;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: { code?: number; data?: Record<string, any>[] } | null = null;

	try {
		// Method 1: corsproxy.io is much better for real-time financial data and respects cache-control
		const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
		const res = await fetch(proxyUrl, { headers: { 'Cache-Control': 'no-cache' } });
		
		if (res.ok) {
			data = await res.json();
		}
	} catch (e) {
		console.error('HTX corsproxy failed:', e);
	}

	// Method 2: Fallback to allorigins, but using the /raw endpoint and explicitly disabling cache
	if (!data || data.code !== 200) {
		try {
			const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}&disableCache=true`;
			const res = await fetch(proxyUrl, { headers: { 'Cache-Control': 'no-cache' } });
			if (res.ok) {
				data = await res.json();
			}
		} catch (e) {
			console.error('HTX allorigins fallback failed:', e);
		}
	}

	if (!data || data.code !== 200 || !data.data) {
		return [];
	}

	return data.data.map((item) => {
		// 1. Force string conversion to prevent Svelte UI rendering crashes
		const priceStr = item.price !== undefined ? item.price.toString() : '0';
		const surplusStr = item.tradeCount !== undefined ? item.tradeCount.toString() : '0';
		const minStr = item.minTradeLimit !== undefined ? item.minTradeLimit.toString() : '0';
		const maxStr = item.maxTradeLimit !== undefined ? item.maxTradeLimit.toString() : '0';

		// 2. Normalize completion rate (HTX returns 98.5 instead of 0.985 like Binance)
		let positiveRate = parseFloat(item.orderCompleteRate || '0');
		if (positiveRate > 1) {
			positiveRate = positiveRate / 100;
		}

		return {
			advNo: item.id?.toString() || Math.random().toString(),
			tradeType: props.type.toUpperCase(),
			asset: props.token.toUpperCase(),
			fiatUnit: props.fiat.toUpperCase(),
			price: priceStr,
			surplusAmount: surplusStr,
			tradableQuantity: surplusStr,
			fiatSymbol: props.fiat.toUpperCase(),
			minSingleTransAmount: minStr,
			maxSingleTransAmount: maxStr,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			paymentMethods: item.payMethods ? item.payMethods.map((method: any) => ({
				type: method.name || 'Bank',
				identifier: method.payMethodId?.toString() || 'unknown',
				name: method.name || 'Bank Transfer'
			})) : [],
			advertiser: {
				name: item.userName || 'Unknown',
				userId: item.uid?.toString() || '',
				monthOrderCount: parseInt(item.tradeMonthTimes || '0', 10),
				positiveRate: positiveRate
			},
			terms: extractTerms(item),
			isNewUserOnly: checkIsNewUserOnly(item)
		};
	}) as ExchangeP2PAd[];
};
