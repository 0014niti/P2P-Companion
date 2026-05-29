import type { RequestHandler } from './$types';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';

// Cache fonts in memory to avoid fetching them on every request
let fontDataNormal: ArrayBuffer | null = null;
let fontDataBlack: ArrayBuffer | null = null;

export const GET: RequestHandler = async ({ url, fetch }) => {
    const fiat = url.searchParams.get('fiat') || 'USD';
    const crypto = url.searchParams.get('crypto') || 'USDT';

    // Satori requires TrueType (TTF) fonts for generation.
    // We fetch the raw .ttf files securely from Fontsource via jsDelivr CDN.
    if (!fontDataNormal) {
        const res = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf');
        fontDataNormal = await res.arrayBuffer();
    }
    if (!fontDataBlack) {
        const res = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-900-normal.ttf');
        fontDataBlack = await res.arrayBuffer();
    }

    // Build the HTML template for the OG image
    const markup = toReactNode(`
        <div style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; flex-direction: column; background-color: #09090b; font-family: 'Inter', sans-serif;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #18181b; border: 2px solid #27272a; padding: 60px 100px; border-radius: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
                <div style="display: flex; align-items: center; justify-content: center; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 40px; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px;">
                    Live Market Data
                </div>
                
                <div style="display: flex; font-size: 110px; font-weight: 900; color: white; letter-spacing: -2px; margin-bottom: 20px;">
                    ${crypto} / ${fiat}
                </div>
                
                <div style="display: flex; font-size: 32px; font-weight: 600; color: #a1a1aa; text-align: center;">
                    Compare Real-Time P2P Spreads
                </div>
                <div style="display: flex; font-size: 32px; font-weight: 600; color: #a1a1aa; text-align: center; margin-top: 10px;">
                    across Binance, OKX, and Bybit
                </div>
            </div>

            <div style="position: absolute; bottom: 40px; display: flex; align-items: center; justify-content: center; width: 100%;">
                <div style="display: flex; font-size: 24px; font-weight: 900; color: #3b82f6; letter-spacing: 1px;">
                    P2PCOMPANION.COM
                </div>
            </div>
        </div>
    `);

    // Generate SVG via Satori
    const svg = await satori(markup as any, {
        width: 1200,
        height: 630,
        fonts: [
            { name: 'Inter', data: fontDataNormal, weight: 600, style: 'normal' },
            { name: 'Inter', data: fontDataBlack, weight: 900, style: 'normal' }
        ],
    });

    // Convert SVG to highly optimized PNG via Resvg
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1200 }
    });

    const pngBuffer = resvg.render().asPng();

    return new Response(pngBuffer, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            'Access-Control-Allow-Origin': '*'
        }
    });
};