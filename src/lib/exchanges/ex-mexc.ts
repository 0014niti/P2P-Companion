import type { ExchangeP2PAd } from '.';

const coinIdsMap: Record<string, string> = {
	USDT: '128f589271cb4951b03e71e6323eb7be',
	BTC: 'febc9973be4d4d53bb374476239eb219',
	ETH: '93c38b0169214f8689763ce9a63a73ff',
	USDC: '34309140878b4ae99f195ac091d49bab',
	TRX: 'fc3c087384814b5d93a6b71f64591194',
	DOGE: 'a1001412a8d34b59b4d25dcce9e217d2',
	SOL: '8dedc95886d14867ad9a1668a38666db',
	TON: 'd50f72a82921467ebf1df6fdc458de7e'
};

export const fetchMexc = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const responses = await Promise.all([
		await fetch('https://p2p.mexc.co/api/payment/method'),
		await fetch(
			`https://p2p.mexc.co/api/market?allowTrade=false&amount=&blockTrade=false&certifiedMerchant=false&coinId=${coinIdsMap[props.token]}&countryCode=&currency=${props.fiat}&follow=false&haveTrade=false&page=1&payMethod=&tradeType=${props.type === 'buy' ? 'SELL' : 'BUY'}`,
			{
				method: 'GET'
			}
		)
	]);

	const payMethods = (await responses[0].json()) as {
		data: { id: number; name: string }[];
	};
	const res = responses[1];

	if (!res.ok || !responses[0].ok) {
		throw new Error(`Error fetching MEXC data: ${res.status} ${res.statusText}`);
	}

	const data = (await res.json()) as {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: Record<string, any>[];
	};

	return data.data.map((item) => ({
		advNo: item.id,
		tradeType: props.type.toUpperCase(),
		asset: item.coinName.toUpperCase(),
		fiatUnit: item.currency,
		price: item.price.toString(),
		surplusAmount: item.wholeMaxTradeLimit.toString(),
		tradableQuantity: item.wholeMaxTradeLimit.toString(),
		fiatSymbol: item.currency, // no symbol
		minSingleTransAmount: item.minTradeLimit.toString(),
		maxSingleTransAmount: item.maxTradeLimit.toString(),
		paymentMethods: item.payMethod.split(',').map((method: string) => {
			const mt = payMethods.data.find((pm) => pm.id === Number(method));
			return {
				type: mt?.name,
				identifier: mt?.id.toString() || method,
				name: mt?.name.split('-'),
				bgColor: null
			};
		}),
		advertiser: {
			name: item.merchant.nickName,
			userId: item.merchant.memberId,
			monthOrderCount: item.merchantStatistics.done180DayCount,
			positiveRate: Number(item.merchantStatistics.completeRate)
		}
	})) as ExchangeP2PAd[];
};
