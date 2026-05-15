import { json } from '@sveltejs/kit';
import { TwitterApi } from 'twitter-api-v2';
import { 
    CRON_SECRET, 
        TWITTER_API_KEY, 
            TWITTER_API_SECRET, 
                TWITTER_ACCESS_TOKEN, 
                    TWITTER_ACCESS_SECRET 
                    } from '$env/static/private';

                    export const GET = async ({ request }) => {
                        // 1. Security Check: Ensure only Vercel (or you) can trigger this bot
                            const authHeader = request.headers.get('authorization');
                                if (authHeader !== `Bearer ${CRON_SECRET}`) {
                                        return json({ error: 'Unauthorized' }, { status: 401 });
                                            }

                                                try {
                                                        // 2. Initialize Twitter Client
                                                                const twitterClient = new TwitterApi({
                                                                            appKey: TWITTER_API_KEY,
                                                                                        appSecret: TWITTER_API_SECRET,
                                                                                                    accessToken: TWITTER_ACCESS_TOKEN,
                                                                                                                accessSecret: TWITTER_ACCESS_SECRET,
                                                                                                                        });

                                                                                                                                // 3. Mock Data
                                                                                                                                        const fiat = 'NGN';
                                                                                                                                                const crypto = 'USDT';
                                                                                                                                                        const buyExchange = 'Bybit';
                                                                                                                                                                const sellExchange = 'Binance';
                                                                                                                                                                        const lowestAsk = 1450.50; 
                                                                                                                                                                                const highestBid = 1480.00; 
                                                                                                                                                                                        const spreadMargin = (((highestBid - lowestAsk) / lowestAsk) * 100).toFixed(2);

                                                                                                                                                                                                // 4. The Threshold Check
                                                                                                                                                                                                        if (parseFloat(spreadMargin) > 1.00) {
                                                                                                                                                                                                                    const tweetText = `🚨 Arbitrage Alert: ${crypto}/${fiat}\n\n` +
                                                                                                                                                                                                                                    `Profitable spread detected: +${spreadMargin}%\n\n` +
                                                                                                                                                                                                                                                    `🟢 Buy on ${buyExchange} at ${lowestAsk.toLocaleString()} ${fiat}\n` +
                                                                                                                                                                                                                                                                    `🔴 Sell on ${sellExchange} at ${highestBid.toLocaleString()} ${fiat}\n\n` +
                                                                                                                                                                                                                                                                                    `View the live order book comparing 6+ exchanges 100% free👇\n` +
                                                                                                                                                                                                                                                                                                    `https://p2pcompanion.com/compare/${fiat.toLowerCase()}/${crypto.toLowerCase()}`;

                                                                                                                                                                                                                                                                                                                // 5. Post to Twitter
                                                                                                                                                                                                                                                                                                                            await twitterClient.v2.tweet(tweetText);
                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                    return json({ success: true, message: 'Alert tweeted successfully' });
                                                                                                                                                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                                                                                                                                                        return json({ success: true, message: 'Spread too low. No tweet sent.' });
                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                    } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                                            console.error('Spread Bot Error:', error);
                                                                                                                                                                                                                                                                                                                                                                                                    return json({ error: 'Failed to execute bot' }, { status: 500 });
                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                        };