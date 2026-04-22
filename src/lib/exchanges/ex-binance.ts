import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchBinance = async (props: {
	type: 'buy' | 'sell';
	token: string;
	fiat: string;
}) => {
	const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
		headers: {
			c2ctype: 'c2c_web',
			clienttype: 'web',
			'content-type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
		},
		body: JSON.stringify({
			fiat: props.fiat.toUpperCase(),
			page: 1,
			rows: 10,
			tradeType: props.type.toUpperCase(),
			asset: props.token.toUpperCase(),
			countries: [],
			proMerchantAds: false,
			shieldMerchantAds: false,
			filterType: 'all',
			periods: [],
			additionalKycVerifyFilter: 0,
			publisherType: null,
			payTypes: [],
			classifies: ['mass', 'profession', 'fiat_trade'],
			tradedWith: false,
			followed: false
		}),
		method: 'POST'
	});

	if (!res.ok) {
		throw new Error(`Error fetching Binance data: ${res.status} ${res.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.json()) as { data: Record<string, any>[] };

	return data.data.map((item) => {
		const extractedText = extractTerms(item);
		
		// Binance merchants often omit text "remarks" and instead rely strictly on numeric "Advertiser's requirements".
		// We synthesize these numeric toggles into readable bullet points so they correctly appear in the UI.
		const reqs: string[] = [];
		
		const regDays = Number(item.adv?.buyerRegDaysLimit || item.adv?.minRegisterDays || 0);
		if (regDays > 0) reqs.push(`Registered ≥ ${regDays} days`);
		
		const btcPos = Number(item.adv?.buyerBtcPositionLimit || 0);
		if (btcPos > 0) reqs.push(`Hold ≥ ${btcPos} BTC`);
		
		const minTrades = Number(item.adv?.userAllTradeCountMin || item.adv?.userBuyTradeCountMin || item.adv?.minCompletedOrders || 0);
		if (minTrades > 0) reqs.push(`Completed ≥ ${minTrades} trades`);
		
		const completeRate = Number(item.adv?.userTradeCompleteRateMin || item.adv?.minCompletionRate || 0);
		if (completeRate > 0) {
			const rate = completeRate <= 1 ? completeRate * 100 : completeRate;
			reqs.push(`Completion rate ≥ ${rate}%`);
		}

		const requirementsText = reqs.length > 0 ? `[Advertiser's Requirements]\n• ` + reqs.join('\n• ') : '';
		let finalTerms = [extractedText, requirementsText].filter(Boolean).join('\n\n').trim();

		if (!finalTerms) {
			finalTerms = "API hidden terms (Click Trade to view)";
		}

		return {
			advNo: item.adv.advNo,
			tradeType: item.adv.tradeType,
			asset: item.adv.asset,
			fiatUnit: item.adv.fiatUnit,
			price: item.adv.price,
			surplusAmount: item.adv.surplusAmount,
			tradableQuantity: item.adv.tradableQuantity,
			fiatSymbol: item.adv.fiatSymbol,
			minSingleTransAmount: item.adv.minSingleTransAmount,
			maxSingleTransAmount: item.adv.maxSingleTransAmount,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			paymentMethods: item.adv.tradeMethods.map((method: Record<string, any>) => ({
				type: method.payType,
				identifier: method.identifier,
				name: method.tradeMethodName,
				bgColor: method.tradeMethodBgColor
			})),
			advertiser: {
				name: item.advertiser.nickName,
				userId: item.advertiser.userNo,
				monthOrderCount: item.advertiser.monthOrderCount,
				positiveRate: item.advertiser.monthFinishRate
			},
			terms: finalTerms,
			isNewUserOnly: checkIsNewUserOnly(item)
		};
	}) as ExchangeP2PAd[];
};
