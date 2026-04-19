export const exchanges = {
	binance: {
		name: 'Binance',
		tokensList: ['USDT', 'BTC', 'FDUSD', 'BNB', 'ETH', 'USDC'] as string[],
		icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Binance_Logo.svg/768px-Binance_Logo.svg.png', // Accessing actual logo `apple-touch-icon` is blocked,
		p2pLink: 'https://p2p.binance.com/en'
	},
	okx: {
		name: 'OKX',
		tokensList: ['USDT', 'USDC', 'BTC', 'ETH'] as string[],
		icon: 'https://www.okx.com/cdn/assets/imgs/253/59830BB78B18A776.png',
		p2pLink: 'https://www.okx.com/p2p-markets'
	},
	// bybit: {
	// 	name: 'Bybit',
	// 	tokensList: ['USDT', 'BTC', 'ETH', 'USDC'] as string[]
	// },
	mexc: {
		name: 'MEXC',
		tokensList: ['USDT', 'BTC', 'ETH', 'USDC', 'TRX', 'DOGE', 'SOL', 'TON'] as string[],
		icon: 'https://static.mocortech.com/image-host/web/web-app-icon-v2.8970dcc55ed4.png',
		p2pLink: 'https://www.mexc.co/buy-crypto/p2p'
	},
	bitget: {
		name: 'Bitget',
		tokensList: ['USDT', 'USDC', 'BTC', 'ETH', 'BGB', 'DAI'] as string[],
		icon: 'https://www.bitget.com/baseasset/favicon4.png',
		p2pLink: 'https://www.bitget.com/p2p-trade'
	}
} as const;

export const availableTokensList = Array.from(
	new Set(Object.values(exchanges).flatMap((exchange) => exchange.tokensList))
).sort((a, b) => b.localeCompare(a));

export const exchangesArr = Object.entries(exchanges).map(([key, value]) => ({ key, ...value }));

export type ExchangeKeys = keyof typeof exchanges;

export type Exchange = (typeof exchanges)[ExchangeKeys];

export const actionTypes = {
	buy: 'BUY',
	sell: 'SELL'
} as const;

export const filterExchangesArr = (selectedToken: string) => {
	return exchangesArr.filter((exchange) => exchange.tokensList.includes(selectedToken));
};

// Only the fields we care about
export type ExchangeP2PAd = {
	advNo: string;
	tradeType: 'BUY' | 'SELL';
	asset: string;
	fiatUnit: string;
	price: string;
	surplusAmount: string;
	tradableQuantity: string;
	fiatSymbol: string;
	minSingleTransAmount: string;
	maxSingleTransAmount: string;
	paymentMethods: {
		type: string;
		identifier: string;
		name: string;
		bgColor?: string;
	}[];
	advertiser: {
		name: string; // Nickname | Real name | ...
		userId: string;
		monthOrderCount: number;
		positiveRate: number;
	};
};
