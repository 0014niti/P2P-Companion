import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import fiatList from '$lib/data/binance-fiat-list.json';

// Dynamically support all currencies from our database
const supportedFiats = fiatList.map(f => f.currencyCode.toUpperCase());
const supportedCryptos = ['USDT', 'BTC', 'ETH'];

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const fiat = params.fiat.toUpperCase();
	const crypto = params.crypto.toUpperCase();

	// 404 error if someone tries a random URL
	if (!supportedFiats.includes(fiat) || !supportedCryptos.includes(crypto)) {
		throw error(404, 'Market pair not supported');
	}

	// Cache the page heavily so it loads instantly for Googlebot
	setHeaders({
		'Cache-Control': 'max-age=600, s-maxage=3600'
	});

	// Generate dynamic date for fresh SEO titles
	const date = new Date();
	const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

	return {
		fiat, crypto, monthYear,
		metaTitle: `Buy ${crypto} with ${fiat} | Compare Best P2P Rates Today (${monthYear})`,
		metaDescription: `Looking to buy ${crypto} with ${fiat}? Compare live P2P rates across Binance, OKX, and Bybit to find the cheapest prices instantly. Updated ${monthYear}.`
	};
};