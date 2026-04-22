import { extractTerms, checkIsNewUserOnly, type ExchangeP2PAd } from '.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractBybitPayments = (item: any, dynamicMap: Record<string, string>) => {
	if (!item || typeof item !== 'object') return [];

	// 1. Prioritize explicit array properties that contain objects
	const objectArrays = [item.payTermDtos, item.paymentMethods, item.payTerms, item.paymethodInfo];
	for (const arr of objectArrays) {
		if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null) {
			return arr.map((m: any) => {
				const id = String(m.payType || m.paymentType || m.methodId || m.id || m.payId || 'unknown');
				let name = m.payName || m.paymentName || m.methodName || m.name || m.paymentType;
				
				// If name is missing or is just a numerical ID, fall back to our dictionary map
				if (!name || /^\d+$/.test(String(name))) {
					name = dynamicMap[String(name || id)] || dynamicMap[id] || `Method ${name || id}`;
				}

				return {
					type: id,
					identifier: id,
					name: String(name),
					bgColor: m.bgColor || m.colorValue || undefined
				};
			});
		}
	}

	// 2. Fallback to flat arrays of IDs
	const flatArrays = [item.payTypes, item.payments, item.payMethodIds];
	for (const arr of flatArrays) {
		if (Array.isArray(arr) && arr.length > 0 && (typeof arr[0] === 'string' || typeof arr[0] === 'number')) {
			return arr.map((val: any) => {
				const strVal = String(val).trim();
				let mappedName = strVal;
				
				if (/^\d+$/.test(strVal)) {
					mappedName = dynamicMap[strVal] || `Method ${strVal}`;
				}
				
				return {
					type: strVal,
					identifier: strVal,
					name: mappedName,
					bgColor: undefined
				};
			});
		}
	}

	return [];
};

export const fetchBybit = async (props: { type: 'buy' | 'sell'; token: string; fiat: string }) => {
	const dynamicMap: Record<string, string> = {};

	const headers = {
		'accept': 'application/json',
		'content-type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		'Origin': 'https://www.bybit.com',
		'Referer': 'https://www.bybit.com/'
	};

	// Run main request and potential dictionary endpoints in parallel for maximum coverage
	const [dict1, dict2, dict3, res] = await Promise.allSettled([
		fetch('https://api2.bybit.com/fiat/otc/payment/option/list', {
			method: 'POST',
			headers,
			body: JSON.stringify({ currencyId: props.fiat.toUpperCase() })
		}),
		fetch('https://api2.bybit.com/fiat/otc/payment/method/list', {
			method: 'POST',
			headers,
			body: JSON.stringify({ currencyId: props.fiat.toUpperCase() })
		}),
		fetch(`https://api2.bybit.com/fiat/otc/payment/option/list?currencyId=${props.fiat.toUpperCase()}`, { method: 'GET', headers }),
		fetch('https://api2.bybit.com/fiat/otc/item/online', {
			headers,
			body: JSON.stringify({
				userId: '',
				tokenId: props.token.toUpperCase(),
				currencyId: props.fiat.toUpperCase(),
				payment: [],
				side: props.type === 'buy' ? '1' : '0',
				size: '10',
				page: '1',
				amount: '',
				authMaker: false,
				canTrade: false
			}),
			method: 'POST'
		})
	]);

	if (res.status === 'rejected') {
		throw new Error(`Error fetching Bybit data: ${String(res.reason)}`);
	}

	if (!res.value.ok) {
		throw new Error(`Error fetching Bybit data: ${res.value.status} ${res.value.statusText}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await res.value.json()) as any;

	// Deep recursive scanner to find ANY valid payment dictionary across ALL successful Bybit responses
	const extractDict = (obj: any) => {
		if (!obj || typeof obj !== 'object') return;
		if (Array.isArray(obj)) {
			obj.slice(0, 100).forEach(extractDict); // Slice prevents massive call stacks
			return;
		}
		
		const id = obj.paymentType || obj.payType || obj.value || obj.payMethodId;
		const name = obj.paymentName || obj.payName || obj.label || obj.payMethodName;
		
		const genericId = id || obj.id;
		const genericName = name || obj.name;

		// Ensure we don't accidentally map user profile properties by checking for payment-specific keys
		if (genericId && genericName && typeof genericId !== 'object' && typeof genericName === 'string' && genericName.length > 2 && !/^\d+$/.test(genericName)) {
			if (id || obj.icon || obj.bgColor || obj.label) {
				dynamicMap[String(genericId)] = genericName;
			}
		}
		
		Object.values(obj).forEach(extractDict);
	};

	extractDict(data); // Scan main response

	for (const dictRes of [dict1, dict2, dict3]) { // Scan secondary dictionary responses
		if (dictRes.status === 'fulfilled' && dictRes.value.ok) {
			try { extractDict(await dictRes.value.json()); } catch (e) { /* ignore */ }
		}
	}

	if (!data?.result?.items) {
		return [];
	}

	return data.result.items.map((item) => ({
		advNo: item.id || Math.random().toString(),
		tradeType: props.type.toUpperCase(),
		asset: props.token.toUpperCase(),
		fiatUnit: props.fiat.toUpperCase(),
		price: item.price,
		surplusAmount: item.lastQuantity || '0',
		tradableQuantity: item.lastQuantity || '0',
		fiatSymbol: props.fiat.toUpperCase(),
		minSingleTransAmount: item.minAmount || '0',
		maxSingleTransAmount: item.maxAmount || '0',
		paymentMethods: extractBybitPayments(item, dynamicMap),
		advertiser: {
			name: item.nickName || 'Unknown',
			userId: item.userId || '',
			monthOrderCount: item.recentOrderNum || 0,
			positiveRate: item.recentExecuteRate || 0
		},
		terms: extractTerms(item),
		isNewUserOnly: checkIsNewUserOnly(item)
	})) as ExchangeP2PAd[];
};