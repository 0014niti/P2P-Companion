import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

const HTX_COINS: Record<string, string> = {
	USDT: '2', BTC: '1', ETH: '3', HT: '4', USDC: '69', TRX: '11'
};

const HTX_FIATS: Record<string, string> = {
	USD: '2', CNY: '1', EUR: '3', GBP: '4', VND: '14',
	PHP: '59', INR: '34', IDR: '13', RUB: '12', NGN: '60', 
	BRL: '44', TRY: '57'  
};

export const fetchHtx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const coinId = HTX_COINS[props.token.toUpperCase()];
	const currencyId = HTX_FIATS[props.fiat.toUpperCase()];

	if (!coinId || !currencyId) return [];

	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
    
    // We add a highly randomized string to the end to aggressively bypass proxy caching
	const targetUrl = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=${coinId}&currency=${currencyId}&tradeType=${tradeType}&currPage=1&payMethod=0&acceptOrder=0&country=&blockType=general&online=1&range=0&amount=&t=${Date.now()}&nocache=${Math.random()}`;

	// Public Proxy Rotation (Aggressive Fallbacks)
    // We explicitly avoid your private Cloudflare worker here to bypass HTX's datacenter block
	const proxies = [
		(url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
		(url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
		(url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: { code?: number; data?: Record<string, any>[] } | null = null;

	// Proxy Rotation Loop
	for (const proxyFactory of proxies) {
		try {
			const proxyUrl = proxyFactory(targetUrl);
			const res = await fetch(proxyUrl, {
				headers: { 'Accept': 'application/json' }
			});
			
			if (res.ok) {
				const text = await res.text();
				try {
					data = JSON.parse(text);
					// If we get a valid code 200 from HTX, break the loop immediately
					if (data && data.code === 200) break; 
				} catch (e) { /* Ignore HTML proxy errors and try next proxy */ }
			}
		} catch (e) {
			console.warn('HTX proxy failed, rotating to backup...');
		}
	}

	if (!data || data.code !== 200 || !data.data) return [];

	return data.data.map((item) => {
		const priceStr = item.price !== undefined ? item.price.toString() : '0';
		const surplusStr = item.tradeCount !== undefined ? item.tradeCount.toString() : '0';
		const minStr = item.minTradeLimit !== undefined ? item.minTradeLimit.toString() : '0';
		const maxStr = item.maxTradeLimit !== undefined ? item.maxTradeLimit.toString() : '0';

		let positiveRate = parseFloat(item.orderCompleteRate || '0');
		if (positiveRate > 1) positiveRate = positiveRate / 100;

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
