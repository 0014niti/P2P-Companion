import { browser } from '$app/environment';

export type P2PFilters = {
	type: 'buy' | 'sell';
	token: string;
	fiat: string;
	amount: number | null;
};

export const filterState = $state<P2PFilters>({
	type: 'buy',
	token: 'USDT',
	fiat: 'USD',
	amount: null
});

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