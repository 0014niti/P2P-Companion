import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

export const fetchBitget = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const res = await fetch('https://www.bitget.com/v1/p2p/pub/adv/queryAdvList', {
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			apptheme: 'standard',
			'content-type': 'application/json;charset=UTF-8',
			language: 'en_US',
			locale: 'en_US',
			usenewpwdversion: 'true',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			'Referer': 'https://www.bitget.com/p2p-trade',
			'Origin': 'https://www.bitget.com',
			'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'Sec-Ch-Ua-Mobile': '?0',
			'Sec-Ch-Ua-Platform': '"Windows"',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin'
		},
		body: JSON.stringify({
			side: props.type === 'buy' ? 1 : 2,
			pageNo: 1,
			pageSize: 10,
			coinCode: props.token.toUpperCase(),
			fiatCode: props.fiat.toUpperCase(),
			orderBy: 1,
			adAreaId: 0,
			orderModeFlag: 'close',
			allowPlaceOrderFlag: '1',
			languageType: 0
		}),
		method: 'POST'
	});

	if (!res.ok) {
		throw new Error(`Error fetching Bitget data: ${res.status} ${res.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.json()) as { data?: { dataList?: Record<string, any>[] } };

	if (!data?.data?.dataList) {
		return [];
	}

	return data.data.dataList.map((item) => ({
		advNo: item.adNo,
		tradeType: props.type.toUpperCase(),
		asset: item.coinCode,
		fiatUnit: item.fiatCode,
		price: item.price,
		surplusAmount: item.editAmount,
		tradableQuantity: item.lastAmount,
		fiatSymbol: item.fiatSymbol,
		minSingleTransAmount: item.minAmount,
		maxSingleTransAmount: item.maxAmount,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		paymentMethods: item.paymethodInfo ? item.paymethodInfo.map((method: Record<string, any>) => ({
			type: method.paymethodName,
			identifier: method.paymethodId,
			name: method.paymethodName,
			bgColor: method.colorValue
		})) : [],
		advertiser: {
			name: item.nickName,
			userId: item.nickName,
			monthOrderCount: item.thirtyTunoverNum,
			positiveRate: item.thirtyCompletionRate
		},
		terms: extractTerms(item),
		isNewUserOnly: checkIsNewUserOnly(item)
	})) as ExchangeP2PAd[];
};
