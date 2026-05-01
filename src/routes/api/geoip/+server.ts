import { json } from '@sveltejs/kit';

// This endpoint will determine the user's fiat based on their IP address
// It's a server-side endpoint to safely get the IP and call external GeoIP services

export async function GET({ request }) {
    // Vercel (and most hosting providers) pass the client's real IP in this header
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');

    // Default to a common fiat if IP is not found or GeoIP fails
    let detectedFiat = 'USD'; 

    if (clientIp) {
        try {
            // Use a free GeoIP API (ip-api.com is good for non-commercial use, check their terms)
            const geoIpResponse = await fetch(`http://ip-api.com/json/${clientIp}`);
            const geoIpData = await geoIpResponse.json();

            if (geoIpData.status === 'success' && geoIpData.countryCode) {
                const countryCode = geoIpData.countryCode.toUpperCase();

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
        } catch (error) {
            console.error('GeoIP lookup failed:', error);
            // Fallback to default if GeoIP service fails
            detectedFiat = 'USD';
        }
    }

    return json({ fiat: detectedFiat });
}