import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
    setHeaders({
        'Cache-Control': 'max-age=600, s-maxage=3600'
    });

    const date = new Date();
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    return {
        metaTitle: `Automated Crypto P2P Arbitrage Scanner | Live Routes ${monthYear}`,
        metaDescription: `Discover the most profitable P2P crypto arbitrage routes across Binance, Bybit, and OKX. Free real-time arbitrage scanner for USDT and BTC.`
    };
};