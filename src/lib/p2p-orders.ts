import { writable } from 'svelte/store';
import { filterExchangesArr, type ExchangeKey } from '$lib/exchanges';
import { fetchUrlBuilder } from '$lib/exchanges/url-builder'; // Assuming this file exists and works
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

		// Fetch live market rates in parallel using Coinbase's free public API
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
			})
			.catch(err => console.error('Failed to fetch market rates:', err));

		const exchangesToFetch = filterExchangesArr(filters.token);

		const allFetchesPromise = exchangesToFetch.map(async (exchange) => {
			try {
				const url = fetchUrlBuilder({ ...filters }, exchange.key);
				const res = await fetch(url);
				if (!res.ok) {
					throw new Error(`Request failed with status ${res.status}`);
				}
				const data = await res.json();

				// Allow responses to be null (empty) or an array. Prevent crashes if the API returns an unexpected shape.
				if (!data || (data.responses !== null && !Array.isArray(data.responses))) {
					console.warn(`Received invalid data structure from ${exchange.name}.`);
					// No data, but not an error state. Just return.
					return;
				}

				const responsesArray = Array.isArray(data.responses) ? data.responses : [];

				// Filter out any invalid ad objects before mapping to prevent crashes
				const validAds = responsesArray.filter((ad): ad is ExchangeP2PAd => !!(ad && ad.advertiser));

				// Normalize data from each exchange into our standard P2POrder format
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
					tradeUrl: exchange.p2pLink,
					isNewUserOnly: ad.isNewUserOnly ?? false
				}));

				// Incrementally update the store with the new orders
				update((s) => {
					const combinedOrders = [...s.orders, ...newOrders];
					combinedOrders.sort((a, b) => (filters.type === 'buy' ? a.price - b.price : b.price - a.price));
					return { ...s, orders: combinedOrders, errors: { ...s.errors, [exchange.key]: null } };
				});
			} catch (error) {
				const fetchError = error instanceof Error ? error : new Error(String(error));
				console.error(`Error processing ${exchange.key}:`, fetchError);
				// Update the store with the error for this specific exchange
				update((s) => ({ ...s, errors: { ...s.errors, [exchange.key]: fetchError } }));
			}
		});

		// Wait for all fetches to complete (either success or failure)
		await Promise.allSettled(allFetchesPromise);

		// Once all are settled, set the global loading state to false
		update((s) => ({ ...s, isLoading: false }));
	}

	return {
		subscribe,
		fetchOrders
	};
}

export const p2pOrderStore = createP2POrderStore();