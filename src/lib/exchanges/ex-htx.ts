import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

const HTX_COINS: Record<string, string> = { USDT: '2', BTC: '1', ETH: '3', HT: '4', USDC: '69', TRX: '11' };
const HTX_FIATS: Record<string, string> = { USD: '2', CNY: '1', EUR: '3', GBP: '4', VND: '14', PHP: '59', INR: '34', IDR: '13', RUB: '12', NGN: '60', BRL: '44', TRY: '57' };

export const fetchHtx = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const coinId = HTX_COINS[props.token.toUpperCase()];
	const currencyId = HTX_FIATS[props.fiat.toUpperCase()];
	if (!coinId || !currencyId) throw new Error(`HTX does not support ${props.token}/${props.fiat}`);

	const tradeType = props.type === 'buy' ? 'sell' : 'buy';
	const targetUrl = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=${coinId}&currency=${currencyId}&tradeType=${tradeType}&currPage=1&payMethod=0&acceptOrder=0&blockType=general`;

	const res = await fetch(targetUrl, {
		headers: { 
			'Accept': 'application/json, text/plain, */*',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
			'Origin': 'https://www.htx.com',
			'Referer': 'https://www.htx.com/'
		}
	});
	
	if (!res.ok) throw new Error(`HTX Blocked (HTTP ${res.status})`);
	const data = await res.json();
	
	if (data.code !== 200 || !data.data) {
		throw new Error(`HTX API Error: ${JSON.stringify(data).substring(0, 50)}`);
	}

	if (data.data.length === 0) {
		throw new Error(`HTX: 0 ads. Try a different Fiat/Token pair.`);
	}

	// Only filter out completely new/empty accounts
	const parsedAds = data.data.filter((item: any) => parseInt(item.tradeMonthTimes || '0', 10) >= 0);

	return parsedAds.map((item: any) => {
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
