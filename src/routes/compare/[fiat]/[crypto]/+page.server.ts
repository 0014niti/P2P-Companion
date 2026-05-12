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
                                                                            metaTitle: `Buy ${crypto} with ${fiat} | Compare Best P2P Rates Today`,
                                                                                    metaDescription: `Looking to buy ${crypto} with ${fiat}? Compare live P2P rates across Binance, OKX, and Bybit to find the cheapest prices instantly without an account.`
                                                                                        };
                                                                                        };