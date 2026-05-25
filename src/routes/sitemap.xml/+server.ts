import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const siteUrl = 'https://p2pcompanion.com';
        
    // Arrays must match the ones defined earlier
    const fiats = ['ngn', 'try', 'ars', 'usd', 'eur', 'gbp', 'php', 'vnd', 'inr', 'rub', 'brl', 'zar'];
    const cryptos = ['usdt', 'btc', 'eth'];
    const payments = ['bank-transfer', 'revolut', 'skrill', 'paypal', 'wise', 'perfect-money', 'advcash'];

    // Start XML string cleanly
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static pages (CORRECTED </loc> tags)
    xml += `
        <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>
        <url><loc>${siteUrl}/terminal</loc><priority>0.9</priority></url>
        <url><loc>${siteUrl}/pro</loc><priority>0.8</priority></url>
        <url><loc>${siteUrl}/markets</loc><priority>0.8</priority></url>
        <url><loc>${siteUrl}/about</loc><priority>0.8</priority></url>
        <url><loc>${siteUrl}/guides</loc><priority>0.8</priority></url>
        <url><loc>${siteUrl}/guides/p2p-arbitrage-explained</loc><priority>0.7</priority></url>
    `;

    // Add fiat dashboards
    for (const fiat of fiats) {
        xml += `
        <url>
            <loc>${siteUrl}/fiat/${fiat}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>`;
    }

    // Loop through arrays and generate URLs for every combination
    for (const crypto of cryptos) {
        for (const fiat of fiats) {
            xml += `
        <url>
            <loc>${siteUrl}/compare/${fiat}/${crypto}</loc>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
        </url>`;

            for (const payment of payments) {
                xml += `
        <url>
            <loc>${siteUrl}/compare/${fiat}/${crypto}/${payment}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.6</priority>
        </url>`;
            }
        }
    }

    xml += `\n</urlset>`;

    // Return the XML, using .trim() to ensure no blank lines at the top of the file
    return new Response(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};