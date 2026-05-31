import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import fiatList from '$lib/data/binance-fiat-list.json';

// Dynamically support all currencies from our database
const supportedFiats = fiatList.map(f => f.currencyCode.toUpperCase());
const supportedCryptos = ['USDT', 'BTC', 'ETH'];
const supportedPayments = ['bank-transfer', 'revolut', 'skrill', 'paypal', 'wise', 'perfect-money', 'advcash'];

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const fiat = params.fiat.toUpperCase();
	const crypto = params.crypto.toUpperCase();
	const payment = params.payment.toLowerCase();

	// 404 error if someone tries a random URL
	if (!supportedFiats.includes(fiat) || !supportedCryptos.includes(crypto) || !supportedPayments.includes(payment)) {
		throw error(404, 'Market pair or payment method not supported');
	}

	// Cache the page heavily so it loads instantly for Googlebot
	setHeaders({
		'Cache-Control': 'max-age=600, s-maxage=3600'
	});

	const date = new Date();
	const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
	const formattedPayment = payment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

	return {
		fiat, crypto, payment, formattedPayment, monthYear,
		metaTitle: `Buy ${crypto} with ${formattedPayment} (${fiat}) | Best P2P Rates ${monthYear}`,
		metaDescription: `Compare the best P2P rates to buy and sell ${crypto} using ${formattedPayment} in ${fiat}. Live arbitrage data across Binance, OKX, and Bybit. Updated ${monthYear}.`
	};
};