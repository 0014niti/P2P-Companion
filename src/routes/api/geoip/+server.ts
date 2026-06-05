import { json } from '@sveltejs/kit';

// This endpoint will determine the user's fiat based on their IP address
// It utilizes Vercel's fast GeoIP headers to avoid external API calls and rate limits.

export async function GET({ request }) {
    // Vercel passes the client's country code in this header
    const vercelCountryCode = request.headers.get('x-vercel-ip-country');

    // Default to a common fiat if not found
    let detectedFiat = 'USD'; 

    if (vercelCountryCode) {
        const countryCode = vercelCountryCode.toUpperCase();

        // Basic mapping of country codes to common fiats
        // This list can be expanded based on your target audience
        const countryToFiatMap: Record<string, string> = {
            US: 'USD', CA: 'CAD', GB: 'GBP', AU: 'AUD', NZ: 'NZD',
            EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
            NG: 'NGN', KE: 'KES', GH: 'GHS', ZA: 'ZAR', EG: 'EGP',
            IN: 'INR', PK: 'PKR', BD: 'BDT', PH: 'PHP', ID: 'IDR', VN: 'VND',
            BR: 'BRL', MX: 'MXN', AR: 'ARS', CO: 'COP', CL: 'CLP', PE: 'PEN',
            RU: 'RUB', TR: 'TRY', UA: 'UAH', PL: 'PLN', CZ: 'CZK',
            AE: 'AED', SA: 'SAR', KW: 'KWD', QA: 'QAR',
            CN: 'CNY', JP: 'JPY', KR: 'KRW', TH: 'THB', MY: 'MYR', SG: 'SGD',
            CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK'
        };

        // Attempt to find a direct mapping, otherwise use the country code itself if it looks like a fiat
        detectedFiat = countryToFiatMap[countryCode] || countryCode;
        // Basic check if it's a 3-letter code, otherwise fallback to USD
        if (detectedFiat.length !== 3) {
            detectedFiat = 'USD';
        }
    }

    return json({ fiat: detectedFiat });
}