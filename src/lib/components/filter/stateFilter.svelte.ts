import { browser } from '$app/environment';
import { fiatList } from '$lib/data/fiat-list'; // <--- THE FIX IS HERE

export type P2PFilters = {
	type: 'buy' | 'sell';
	token: string;
	fiat: string;
	amount: number | null;
};

const filterState = $state<P2PFilters>({
	type: 'buy',
	token: 'USDT',
	fiat: 'USD',
	amount: null
});

// Wrapped in an IIFE to keep the bundler safe
(function initFiat() {
	if (!browser) return;
	try {
		const savedFiat = localStorage.getItem('user_fiat');
		if (savedFiat) {
			filterState.fiat = savedFiat;
		} else {
			fetch('https://ipapi.co/currency/')
				.then((res) => res.text())
				.then((currency) => {
					const code = currency.trim().toUpperCase();
					if (code.length === 3) {
						filterState.fiat = code;
						localStorage.setItem('user_fiat', code); 
					}
				})
				.catch(() => console.warn('Failed to detect IP currency'));
		}
	} catch (e) {
		console.warn('Local storage access denied');
	}
})();

export const filterStore = {
	get filters() { return filterState; },
	setType(type: 'buy' | 'sell') { filterState.type = type; },
	setToken(token: string) { filterState.token = token; },
	setFiat(fiat: string) {
		filterState.fiat = fiat;
		if (browser) localStorage.setItem('user_fiat', fiat);
	},
	setAmount(amount: number | null) { filterState.amount = amount; }
};
