import { writable } from 'svelte/store';
import { filterExchangesArr, getDynamicLink, type ExchangeKey } from '$lib/exchanges';
import { fetchUrlBuilder } from '$lib/exchanges/url-builder'; 
import type { ExchangeP2PAd, P2POrder } from '$lib/types';

type P2PState = {
	orders: P2POrder[];
	isLoading: boolean;
	errors: Partial<Record<ExchangeKey, Error | null>>;
	marketRate: number | null;
	usdRate: number | null;
	token: string | null;
	fiat: string | null;
};

function createP2POrderStore() {
	const { subscribe, set, update } = writable<P2PState>({
		orders: [],
		isLoading: false,
		errors: {},
		marketRate: null,
		usdRate: null,
		token: null,
		fiat: null
	});

	async function fetchOrders(filters: { type: 'buy' | 'sell'; token: string; fiat: string }) {
		update((s) => ({ ...s, isLoading: true, orders: [], errors: {}, marketRate: null, usdRate: null, token: filters.token, fiat: filters.fiat }));

		fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD')
			.then(res => res.json())
			.then(json => {
				const rates = json?.data?.rates;
				if (!rates) return;
				const fiatRate = Number(rates[filters.fiat.toUpperCase()]);
				const tokenRate = Number(rates[filters.token.toUpperCase()]);
				if (fiatRate) {
					let mRate = null;
					const tokenUp = filters.token.toUpperCase();
					if (['USDT', 'USDC', 'FDUSD', 'DAI'].includes(tokenUp)) {
						mRate = tokenRate ? (fiatRate / tokenRate) : fiatRate;
					} else if (tokenRate) {
						mRate = fiatRate / tokenRate;
					}
					update(s => ({ ...s, usdRate: fiatRate, marketRate: mRate }));
				}
			}).catch(err => console.error('Failed to fetch market rates:', err));

		const exchangesToFetch = filterExchangesArr(filters.token);

		const allFetchesPromise = exchangesToFetch.map(async (exchange) => {
			try {
				let responsesArray: ExchangeP2PAd[] = [];

				// --- CLEAN UNIFIED FETCH ---
				// All active exchanges now flow directly through your Vercel backend
				const url = fetchUrlBuilder({ ...filters }, exchange.key);
				const res = await fetch(url);
				if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
				
				const data = await res.json();
				responsesArray = Array.isArray(data?.responses) ? data.responses : [];

				const validAds = responsesArray.filter((ad): ad is ExchangeP2PAd => !!(ad && ad.advertiser));

				const newOrders: P2POrder[] = validAds.map((ad) => ({
					id: `${exchange.key}-${ad.advNo}`,
					exchange: exchange.name,
					merchantName: ad.advertiser.name,
					merchantStats: { monthOrderCount: ad.advertiser.monthOrderCount || 0, positiveRate: ad.advertiser.positiveRate || 0 },
					price: Number(ad.price) || 0,
					fiat: ad.fiatUnit,
					available: Number(ad.surplusAmount) || 0,
					token: filters.token,
					minLimit: Number(ad.minSingleTransAmount) || 0,
					maxLimit: Number(ad.maxSingleTransAmount) || 0,
					paymentMethods: ad.paymentMethods || [],
					terms: ad.terms || ad.remarks || ad.remark || '',
					tradeUrl: getDynamicLink(exchange.key, filters.type, filters.token, filters.fiat, ad.advNo, ad.advertiser?.userId),
					isNewUserOnly: ad.isNewUserOnly ?? false
				}));

				update((s) => {
					const combinedOrders = [...s.orders, ...newOrders];
					combinedOrders.sort((a, b) => (filters.type === 'buy' ? a.price - b.price : b.price - a.price));
					return { ...s, orders: combinedOrders, errors: { ...s.errors, [exchange.key]: null } };
				});
			} catch (error) {
				const fetchError = error instanceof Error ? error : new Error(String(error));
				update((s) => ({ ...s, errors: { ...s.errors, [exchange.key]: fetchError } }));
			}
		});

		await Promise.allSettled(allFetchesPromise);
		update((s) => ({ ...s, isLoading: false }));
	}

	return { subscribe, fetchOrders };
}

export const p2pOrderStore = createP2POrderStore();
