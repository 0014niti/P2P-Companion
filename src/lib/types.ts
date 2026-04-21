export type P2POrder = {
	id: string;
	exchange: string;
	merchantName: string;
	merchantStats?: {
		monthOrderCount: number;
		positiveRate: number;
	};
	price: number;
	fiat: string;
	available: number;
	token: string;
	minLimit: number;
	maxLimit: number;
	paymentMethods: { name: string; bgColor?: string }[];
	terms?: string;
	tradeUrl?: string;
	isRestricted?: boolean;
};

export type ExchangeP2PAd = {
	advNo: string;
	price: string;
	fiatUnit: string;
	surplusAmount: string;
	minSingleTransAmount: string;
	maxSingleTransAmount: string;
	advertiser: {
		name: string;
		monthOrderCount: number;
		positiveRate: number;
	};
	paymentMethods: {
		name: string;
		bgColor?: string;
	}[];
	remarks?: string;
	remark?: string;
	terms?: string;
	isRestricted?: boolean;
};