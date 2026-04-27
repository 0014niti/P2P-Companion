import { browser } from '$app/environment';
import fiatList from '$lib/data/binance-fiat-list.json';

export type P2PFilters = {
	type: 'buy' | 'sell';
	token: string;
	fiat: string;
	amount: number | null;
};

// Default starting state
const filterState = $state<P2PFilters>({
	type: 'buy',
	token: 'USDT',
	fiat: 'USD', 
	amount: null
});

// FEATURE: IP-Based Auto Detection & Local Storage
if (browser) {
	const savedFiat = localStorage.getItem('user_fiat');
	
	if (savedFiat && fiatList.some((f) => f.currencyCode === savedFiat)) {
		// Load from memory if they visited before
		filterState.fiat = savedFiat;
	} else {
		// First visit: Detect IP currency
		fetch('https://ipapi.co/currency/')
			.then((res) => res.text())
			.then((currency) => {
				const code = currency.trim().toUpperCase();
				// Ensure the detected currency actually exists in our supported list
				if (code.length === 3 && fiatList.some((f) => f.currencyCode === code)) {
					filterState.fiat = code;
					localStorage.setItem('user_fiat', code); // Save for next time
				}
			})
			.catch((err) => console.warn('Failed to detect IP currency, defaulting to USD', err));
	}
}

export const filterStore = {
	get filters() {
		return filterState;
	},
	setType(type: 'buy' | 'sell') {
		filterState.type = type;
	},
	setToken(token: string) {
		filterState.token = token;
	},
	setFiat(fiat: string) {
		filterState.fiat = fiat;
		// Save manual overrides to memory
		if (browser) localStorage.setItem('user_fiat', fiat);
	},
	setAmount(amount: number | null) {
		filterState.amount = amount;
	}
};
