import { browser } from '$app/environment';

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
// Wrapped in a self-executing function to protect Rollup's AST builder
(function initFiat() {
	if (!browser) return;
	try {
		const savedFiat = localStorage.getItem('user_fiat');
		if (savedFiat) {
			// Load from memory if they visited before
			filterState.fiat = savedFiat;
		} else {
			// First visit: Detect IP currency
			fetch('https://ipapi.co/currency/')
				.then((res) => res.text())
				.then((currency) => {
					const code = currency.trim().toUpperCase();
					// Safe assignment without complex JSON AST tracing
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
