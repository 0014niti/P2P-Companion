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
	bybit: {
		name: 'Bybit',
		tokensList: ['USDT', 'BTC', 'ETH', 'USDC'] as string[],
		icon: 'https://cdn.bybit.com/favicon.ico',
		p2pLink: 'https://www.bybit.com/fiat/trade/otc'
	},
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
	},
	kucoin: {
		name: 'KuCoin',
		tokensList: ['USDT', 'BTC', 'ETH', 'KCS', 'USDC'] as string[],
		icon: 'https://assets.staticimg.com/cms/media/3g12bgqVCEJ4yVw9EIfYg7w2bBvE2rRihD1EaZk5s.png',
		p2pLink: 'https://www.kucoin.com/p2p'
	},
	htx: {
		name: 'HTX',
		tokensList: ['USDT', 'BTC', 'ETH', 'HT', 'USDC'] as string[],
		icon: 'https://www.htx.com/favicon.ico',
		p2pLink: 'https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt-usd'
	},
	bingx: {
		name: 'BingX',
		tokensList: ['USDT', 'BTC', 'ETH', 'USDC'] as string[],
		icon: 'https://bingx.com/favicon.ico',
		p2pLink: 'https://bingx.com/en-us/p2p/'
	},
	gateio: {
		name: 'Gate.io',
		tokensList: ['USDT', 'BTC', 'ETH', 'DOGE'] as string[],
		icon: 'https://www.gate.io/favicon.ico',
		p2pLink: 'https://www.gate.io/p2p'
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
	terms?: string;
	isRestricted?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractTerms = (item: any): string => {
	if (!item || typeof item !== 'object') return '';
	
	const termsSet = new Set<string>();

	// 1. Check highly probable known paths first
	const explicitPaths = [
		item.remark,
		item.remarks,
		item.advRemark,
		item.publicRemark,
		item.creatorRemark,
		item.advertiserRemark,
		item.merchantRemark,
		item.tradeRemark,
		item.instructions,
		item.tradeConditions,
		item.userIntro,
		item.detail,
		item.description,
		item.message,
		item.adv?.remarks,
		item.adv?.remark,
		item.adv?.tradeConditions,
		item.adv?.autoReplyMsg,
		item.adv?.requirements,
		item.advertiser?.userIntro,
		item.advertiser?.remark,
		item.merchant?.remark,
		item.merchant?.merchantRemark,
		item.terms,
		item.content,
		item.adv?.content,
		item.adv?.terms
	];

	explicitPaths.forEach(t => {
		if (typeof t === 'string' && t.trim().length > 0) {
			termsSet.add(t.trim());
		}
	});

	// 2. Perform a deep scan of the entire JSON object to catch hidden/renamed keys
	const termKeywords = ['remark', 'term', 'instruction', 'condition', 'intro', 'message', 'msg', 'reply', 'require', 'notice', 'content', 'comment', 'memo', 'detail', 'desc', 'policy'];
	const excludeKeywords = ['name', 'id', 'type', 'price', 'amount', 'limit', 'url', 'symbol', 'currency', 'code', 'error', 'number', 'count', 'rate', 'avatar', 'title', 'uuid', 'hash', 'signature'];

	const scan = (obj: any, depth = 0) => {
		// Limit depth to 5 to prevent infinite loops on massive API objects
		if (depth > 5 || !obj || typeof obj !== 'object') return;

		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') {
				const trimmed = value.trim();
				if (trimmed.length > 2) {
					const lowerKey = key.toLowerCase();
					
					const isTermKey = termKeywords.some(tk => lowerKey.includes(tk));
					const isExcluded = excludeKeywords.some(ek => lowerKey.includes(ek));

					if (isTermKey && !isExcluded) {
						termsSet.add(trimmed);
					} else if (trimmed.length > 25 && trimmed.includes(' ') && !trimmed.startsWith('http') && !isExcluded && !lowerKey.includes('time') && !lowerKey.includes('date')) {
						// Aggressive fallback: if it's a long sentence-like string, it's very likely the terms.
						termsSet.add(trimmed);
					}
				}
			} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				scan(value, depth + 1);
			}
		}
	};

	scan(item);

	return Array.from(termsSet).join('\n\n').trim();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkIsRestricted = (item: any): boolean => {
	if (!item || typeof item !== 'object') return false;

	// Check explicit tradable flags from APIs that return false if restricted
	if (
		item.isTradable === false || item.tradable === false || 
		item.canTrade === false || item.allowTrade === false || 
		item.adv?.isTradable === false || item.adv?.tradable === false
	) return true;

	// Check for specific requirement limits commonly found in Binance, OKX, etc.
	if (item.adv?.buyerRegDaysLimit > 0 || item.adv?.buyerBtcPositionLimit > 0) return true;
	if (item.minRegisterDays > 0 || item.countryLimit || item.adv?.countryLimit) return true;
	
	return false;
};
