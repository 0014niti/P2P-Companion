import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// List the primary currencies you want to rank for
const supportedFiats = ['NGN', 'TRY', 'ARS', 'USD', 'EUR', 'GBP', 'PHP', 'VND', 'INR', 'RUB', 'BRL', 'ZAR'];
const supportedCryptos = ['USDT', 'BTC', 'ETH'];

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    const fiat = params.fiat.toUpperCase();
    const crypto = params.crypto.toUpperCase();
    const paymentSlug = params.payment.toLowerCase();
    const payment = paymentSlug.replace(/-/g, ' '); 

    if (!supportedFiats.includes(fiat) || !supportedCryptos.includes(crypto)) {
        throw error(404, 'Market pair not supported');
    }

    setHeaders({
        'Cache-Control': 'max-age=600, s-maxage=3600'
    });

    const date = new Date();
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    const paymentTitle = payment.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        fiat, crypto, paymentSlug, paymentTitle, monthYear,
        metaTitle: `Buy ${crypto} with ${paymentTitle} (${fiat}) | Best P2P Rates ${monthYear}`,
        metaDescription: `Compare the cheapest P2P rates to buy ${crypto} using ${paymentTitle} in ${fiat}. Real-time arbitrage data from Binance, OKX, and Bybit. Updated ${monthYear}.`
    };
};