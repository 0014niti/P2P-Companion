import { ImageResponse } from '@vercel/og';
import { html } from 'satori-html';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    // Extract parameters from the URL or use defaults
    const fiat = url.searchParams.get('fiat') ?? 'NGN';
    const crypto = url.searchParams.get('crypto') ?? 'USDT';
    const premium = url.searchParams.get('premium') ?? '2.4';
    const buyEx = url.searchParams.get('buy') ?? 'Binance';
    const sellEx = url.searchParams.get('sell') ?? 'OKX';

    // Note: Satori requires inline styles and flexbox for layout
    const markup = html`
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: #111827; color: white; font-family: sans-serif;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 40px;">
                <h1 style="font-size: 72px; font-weight: bold; margin: 0; color: #60a5fa;">P2P Terminal</h1>
                <span style="font-size: 36px; color: #9ca3af; margin-top: 10px;">Live Crypto Arbitrage Scanner</span>
            </div>
            
            <div style="display: flex; background-color: #1f2937; padding: 40px 60px; border-radius: 24px; border: 2px solid #374151; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
                <div style="display: flex; flex-direction: column; align-items: center; margin-right: 60px;">
                    <span style="font-size: 32px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">Spread Found</span>
                    <span style="font-size: 96px; font-weight: bold; color: #10b981; line-height: 1;">+${premium}%</span>
                </div>
                
                <div style="display: flex; flex-direction: column; justify-content: center; font-size: 36px; border-left: 2px solid #374151; padding-left: 60px;">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <span style="color: #9ca3af; width: 100px;">Buy:</span>
                        <span style="font-weight: bold;">${crypto} on <span style="color: #f59e0b;">${buyEx}</span></span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="color: #9ca3af; width: 100px;">Sell:</span>
                        <span style="font-weight: bold;">for ${fiat} on <span style="color: #f59e0b;">${sellEx}</span></span>
                    </div>
                </div>
            </div>

            <div style="display: flex; position: absolute; bottom: 40px; font-size: 24px; color: #6b7280;">
                p2pcompanion.com
            </div>
        </div>
    `;

    return new ImageResponse(markup, {
        width: 1200,
        height: 630,
    });
};