import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// List the primary currencies you want to rank for
const supportedFiats = ['NGN', 'TRY', 'ARS', 'USD', 'EUR', 'GBP', 'PHP', 'VND', 'INR', 'RUB', 'BRL', 'ZAR'];
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

                                                    return {
                                                            fiat,
                                                                    crypto,
                                                                            metaTitle: `Live ${crypto} to ${fiat} Best p2p rates | cheapest Rates Today`,
                                                                                    metaDescription: `Compare live ${crypto}/${fiat} P2P rates across Binance, OKX, Bitget, kucoin, MEXC and Bybit. Find the highest profitable trades and cheapest buying price  instantly without an account.`
                                                                                        };
                                                                                        };