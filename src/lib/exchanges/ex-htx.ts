import type { ExchangeP2PAd } from '.';

// HTX (Huobi) uses internal integer IDs for tokens and fiats instead of standard string codes.
// Add additional fiat mapping IDs here if you expand the app to more countries.
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
	RUB: '12'
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
	
	const targetUrl = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=${coinId}&currency=${currencyId}&tradeType=${tradeType}&currPage=1&payMethod=0&acceptOrder=0&country=&blockType=general&online=1&range=0&amount=&t=${Date.now()}`;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: { code?: number; data?: Record<string, any>[] } | null = null;

	try {
		// Method 1: Use AllOrigins GET wrapper without ANY custom headers.
		// This forces the proxy to use its own clean IP and default headers.
		const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
		const res = await fetch(proxyUrl);
		const proxyResponse = await res.json();
		
		if (proxyResponse?.contents) {
			data = JSON.parse(proxyResponse.contents);
		}
	} catch (e) {
		console.error('HTX Proxy fetch failed:', e);
	}

	// Method 2: Fallback to direct fetch if proxy fails or returns an HTML block instead of JSON
	if (!data || data.code !== 200) {
		const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' };
		const res = await fetch(targetUrl, { headers, method: 'GET' });
		if (res.ok) {
			data = await res.json();
		}
	}

	if (!data || data.code !== 200 || !data.data) {
		return [];
	}

	return data.data.map((item) => ({
		advNo: item.id?.toString() || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price || '0',
		surplusAmount: item.tradeCount || '0',
		tradableQuantity: item.tradeCount || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.minTradeLimit || '0',
		maxSingleTransAmount: item.maxTradeLimit || '0',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.payMethods ? item.payMethods.map((method: any) => ({
			type: method.name || 'Bank',
			identifier: method.payMethodId?.toString() || 'unknown',
			name: method.name || 'Bank Transfer'
		})) : [],
		advertiser: {
			name: item.userName || 'Unknown',
			userId: item.uid?.toString() || '',
			monthOrderCount: item.tradeMonthTimes || 0,
			positiveRate: item.orderCompleteRate || 0
		}
	})) as ExchangeP2PAd[];
};