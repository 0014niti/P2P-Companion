import type { RequestHandler } from './$types';
import fiatList from '$lib/data/binance-fiat-list.json';

// Optional: If your fiat list and routes don't change often, uncomment the next line to build this once at deploy time!
// export const prerender = true;

export const GET: RequestHandler = async () => {
    const siteUrl = 'https://p2pcompanion.com';
        
    // Dynamically pull all fiats!
    const fiats = fiatList.map(f => f.currencyCode.toLowerCase());
    const cryptos = ['usdt', 'btc', 'eth'];

    // Using an array for string building is much more CPU/Memory efficient than += string concatenation for large loops
    const urls: string[] = [];

    // Add static pages
    urls.push(
        `<url><loc>${siteUrl}/</loc><priority>1.0</priority></url>`,
        `<url><loc>${siteUrl}/terminal</loc><priority>0.9</priority></url>`,
        `<url><loc>${siteUrl}/pro</loc><priority>0.8</priority></url>`,
        `<url><loc>${siteUrl}/markets</loc><priority>0.8</priority></url>`,
        `<url><loc>${siteUrl}/about</loc><priority>0.8</priority></url>`,
        `<url><loc>${siteUrl}/guides</loc><priority>0.8</priority></url>`,
        `<url><loc>${siteUrl}/guides/p2p-arbitrage-explained</loc><priority>0.7</priority></url>`,
        `<url><loc>${siteUrl}/arbitrage</loc><priority>0.9</priority></url>`,
        `<url><loc>${siteUrl}/blog</loc><priority>0.9</priority></url>`,
        `<url><loc>${siteUrl}/calculator</loc><priority>0.8</priority></url>`
    );

    // Add fiat dashboards
    for (const fiat of fiats) {
        urls.push(`<url><loc>${siteUrl}/fiat/${fiat}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`);
    }

    // Loop through core combinations ONLY. 
    // We removed the payment methods loop to prevent Google from penalizing the site for "Thin Content" 
    // (empty combinations with no active merchants). Focus search engine crawl budget on the core pairs.
    for (const crypto of cryptos) {
        for (const fiat of fiats) {
            urls.push(`<url><loc>${siteUrl}/compare/${fiat}/${crypto}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`);
        }
    }

    // Add dynamic blog posts
    try {
        const posts = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default', eager: true });
        for (const path in posts) {
            const slug = path.split('/').pop()?.replace('.md', '');
            if (slug) {
                urls.push(`<url><loc>${siteUrl}/blog/${slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            }
        }
    } catch (e) {
        // Ignore if no posts exist
    }

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};