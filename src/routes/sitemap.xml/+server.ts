import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const siteUrl = 'https://p2pcompanion.com';
        
            // Arrays must match the ones defined earlier
                const fiats = ['ngn', 'try', 'ars', 'usd', 'eur', 'gbp', 'php', 'vnd', 'inr', 'rub', 'brl', 'zar'];
                    const cryptos = ['usdt', 'btc', 'eth'];

                        // Start XML string
                            let xml = `<?xml version="1.0" encoding="UTF-8" ?>`;
                                xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

                                    // Add static pages
                                        xml += `
                                                <url><loc>${siteUrl}/</url><priority>1.0</priority></url>
                                                        <url><loc>${siteUrl}/terminal</url><priority>0.9</priority></url>
                                                                <url><loc>${siteUrl}/pro</url><priority>0.8</priority></url>
                                                                        <url><loc>${siteUrl}/markets</url><priority>0.8</priority></url>
                                                                            `;

                                                                                // Loop through arrays and generate URLs for every combination
                                                                                    for (const crypto of cryptos) {
                                                                                            for (const fiat of fiats) {
                                                                                                        xml += `
                                                                                                                    <url>
                                                                                                                                    <loc>${siteUrl}/spreads/${fiat}/${crypto}</loc>
                                                                                                                                                    <changefreq>daily</changefreq>
                                                                                                                                                                    <priority>0.7</priority>
                                                                                                                                                                                </url>`;
                                                                                                                                                                                        }
                                                                                                                                                                                            }

                                                                                                                                                                                                xml += `</urlset>`;

                                                                                                                                                                                                    // Return the XML with correct headers so the browser/bots read it properly
                                                                                                                                                                                                        return new Response(xml, {
                                                                                                                                                                                                                headers: {
                                                                                                                                                                                                                            'Content-Type': 'application/xml',
                                                                                                                                                                                                                                        'Cache-Control': 'max-age=0, s-maxage=3600'
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                    };