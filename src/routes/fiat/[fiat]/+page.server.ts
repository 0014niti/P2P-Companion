import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const supportedFiats = ['NGN', 'TRY', 'ARS', 'USD', 'EUR', 'GBP', 'PHP', 'VND', 'INR', 'RUB', 'BRL', 'ZAR'];

const fiatNames: Record<string, string> = {
    'NGN': 'Nigerian Naira',
    'TRY': 'Turkish Lira',
    'ARS': 'Argentine Peso',
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'PHP': 'Philippine Peso',
    'VND': 'Vietnamese Dong',
    'INR': 'Indian Rupee',
    'RUB': 'Russian Ruble',
    'BRL': 'Brazilian Real',
    'ZAR': 'South African Rand'
};

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    const fiat = params.fiat.toUpperCase();

    if (!supportedFiats.includes(fiat)) {
        throw error(404, 'Fiat currency not supported');
    }

    setHeaders({
        'Cache-Control': 'max-age=600, s-maxage=3600'
    });

    const fiatName = fiatNames[fiat] || fiat;
    const date = new Date();
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    return {
        fiat, fiatName, monthYear,
        metaTitle: `${fiatName} (${fiat}) Crypto P2P Market Dashboard | Live Rates ${monthYear}`,
        metaDescription: `Live ${fiatName} (${fiat}) peer-to-peer crypto market dashboard. Compare USDT premiums, active exchanges, and arbitrage spreads across global P2P platforms.`
    };
};