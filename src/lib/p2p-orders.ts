import { writable } from 'svelte/store';
import { filterExchangesArr, type ExchangeKey } from '$lib/exchanges';
import { fetchUrlBuilder } from '$lib/exchanges/url-builder'; // Assuming this file exists and works
import type { ExchangeP2PAd, P2POrder } from '$lib/types';

type P2PState = {
	orders: P2POrder[];
	isLoading: boolean;
	errors: Partial<Record<ExchangeKey, Error | null>>;
};

function createP2POrderStore() {
	const { subscribe, set, update } = writable<P2PState>({
		orders: [],
		isLoading: false,
		errors: {}
	});

	async function fetchOrders(filters: { type: 'buy' | 'sell'; token: string; fiat: string }) {
		update((s) => ({ ...s, isLoading: true, orders: [], errors: {} }));

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
					isRestricted: ad.isRestricted ?? false
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