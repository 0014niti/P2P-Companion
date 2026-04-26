import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

const HTX_COINS: Record<string, string> = { USDT: '2', BTC: '1', ETH: '3', HT: '4', USDC: '69', TRX: '11' };
const HTX_FIATS: Record<string, string> = { USD: '2', CNY: '1', EUR: '3', GBP: '4', VND: '14', PHP: '59', INR: '34', IDR: '13', RUB: '12', NGN: '60', BRL: '44', TRY: '57' };

export const fetchHtx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const coinId = HTX_COINS[props.token.toUpperCase()];
	const currencyId = HTX_FIATS[props.fiat.toUpperCase()];
	if (!coinId || !currencyId) return [];

	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
    // Reverted back to general, but with the Vercel Edge Chrome headers
	const targetUrl = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=${coinId}&currency=${currencyId}&tradeType=${tradeType}&currPage=1&payMethod=0&acceptOrder=0&country=&blockType=general&online=1&range=0&amount=&t=${Date.now()}`;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: { code?: number; data?: Record<string, any>[] } | null = null;

	try {
		const res = await fetch(targetUrl, {
			headers: { 
				'Accept': 'application/json, text/plain, */*',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				'Accept-Language': 'en-US,en;q=0.9',
				'Origin': 'https://www.htx.com',
				'Referer': 'https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt-usd/',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin'
			}
		});
		if (res.ok) {
			const text = await res.text();
			try { data = JSON.parse(text); } catch (e) { /* quiet ignore */ }
		}
	} catch (e) { console.warn('HTX direct fetch failed:', e); }

	if (!data || data.code !== 200 || !data.data) return [];

    // --- THE SOFTWARE FILTER ---
    // Destroy the fake prices posted by manipulators
    const verifiedRealAds = data.data.filter(item => {
        const monthOrders = parseInt(item.tradeMonthTimes || '0', 10);
        const compRate = parseFloat(item.orderCompleteRate || '0');
        // Merchant MUST have at least 10 trades this month and 80%+ completion rate
        return monthOrders >= 10 && compRate >= 80;
    });

	return verifiedRealAds.map((item) => {
		const priceStr = item.price !== undefined ? item.price.toString() : '0';
		const surplusStr = item.tradeCount !== undefined ? item.tradeCount.toString() : '0';
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
			minSingleTransAmount: item.minTradeLimit?.toString() || '0',
			maxSingleTransAmount: item.maxTradeLimit?.toString() || '0',
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
