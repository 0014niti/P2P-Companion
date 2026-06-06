<script lang="ts">
    import { p2pOrderStore } from '$lib/p2p-orders';
    import { Search, ArrowRight, Lock, ShieldAlert, Activity, BarChart2 } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';

    let { data } = $props();
    const { metaTitle, metaDescription } = data;

    const fiats = ['NGN', 'TRY', 'ARS', 'USD', 'EUR', 'GBP', 'PHP', 'VND', 'INR', 'RUB', 'BRL', 'ZAR'];
    const cryptos = ['USDT', 'BTC', 'ETH'];

    let selectedFiat = $state('NGN');
    let selectedCrypto = $state('USDT');
    
    let isScanning = $state(false);
    let hasScanned = $state(false);
    let routes = $state<any[]>([]);

    // Beautifully crafted dummy data to ensure the Paywall always looks enticing!
    const dummyRoutes = [
        { buy: { exchange: 'Binance', price: 1140, paymentMethods: [{name: 'Bank Transfer'}] }, sell: { exchange: 'Bybit', price: 1165, paymentMethods: [{name: 'Chipper Cash'}] }, profitPct: 2.19, profitFiat: 25 },
        { buy: { exchange: 'OKX', price: 1145, paymentMethods: [{name: 'Skrill'}] }, sell: { exchange: 'Binance', price: 1160, paymentMethods: [{name: 'Bank Transfer'}] }, profitPct: 1.31, profitFiat: 15 },
        { buy: { exchange: 'KuCoin', price: 1150, paymentMethods: [{name: 'Revolut'}] }, sell: { exchange: 'OKX', price: 1158, paymentMethods: [{name: 'Wise'}] }, profitPct: 0.69, profitFiat: 8 },
        { buy: { exchange: 'Binance', price: 1142, paymentMethods: [{name: 'Paypal'}] }, sell: { exchange: 'KuCoin', price: 1150, paymentMethods: [{name: 'Bank Transfer'}] }, profitPct: 0.70, profitFiat: 8 },
        { buy: { exchange: 'Bybit', price: 1148, paymentMethods: [{name: 'Skrill'}] }, sell: { exchange: 'OKX', price: 1155, paymentMethods: [{name: 'Neteller'}] }, profitPct: 0.61, profitFiat: 7 }
    ];

    async function scanMarket() {
        isScanning = true;
        hasScanned = false;
        routes = [];

        try {
            // 1. Fetch Asks (Merchants selling to us, so we BUY)
            await p2pOrderStore.fetchOrders({ type: 'buy', token: selectedCrypto, fiat: selectedFiat });
            const buyOrders = [...$p2pOrderStore.orders];

            // 2. Fetch Bids (Merchants buying from us, so we SELL)
            await p2pOrderStore.fetchOrders({ type: 'sell', token: selectedCrypto, fiat: selectedFiat });
            const sellOrders = [...$p2pOrderStore.orders];

            const pairMap = new Map();

            // 3. The Core Arbitrage Algorithm
            for (const buy of buyOrders) {
                for (const sell of sellOrders) {
                    if (sell.price > buy.price) {
                        const buyMethod = buy.paymentMethods?.[0]?.name || 'Any';
                        const sellMethod = sell.paymentMethods?.[0]?.name || 'Any';
                        
                        const pairKey = `${buy.exchange}-${buyMethod}->${sell.exchange}-${sellMethod}`;
                        const profitPct = ((sell.price - buy.price) / buy.price) * 100;

                        if (!pairMap.has(pairKey) || pairMap.get(pairKey).profitPct < profitPct) {
                            pairMap.set(pairKey, {
                                buy, sell, profitPct, profitFiat: sell.price - buy.price
                            });
                        }
                    }
                }
            }

            routes = Array.from(pairMap.values()).sort((a, b) => b.profitPct - a.profitPct);
        } catch (err) {
            console.error("Scanner Error", err);
        }

        isScanning = false;
        hasScanned = true;
    }
</script>

<svelte:head>
    <title>{metaTitle}</title>
    <meta name="description" content={metaDescription} />
</svelte:head>

<div class="mx-auto max-w-screen-xl px-4 py-12 lg:py-16">
    <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center justify-center size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <BarChart2 class="size-8 text-emerald-500" />
        </div>
        <h1 class="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">Automated Arbitrage Scanner</h1>
        <p class="text-lg text-zinc-600 dark:text-zinc-400">Discover real-time, cross-exchange P2P spreads. Spot profitable margins before they disappear.</p>
    </div>

    <div class="max-w-4xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl mb-12">
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Fiat Currency</label>
                <select bind:value={selectedFiat} class="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none">
                    {#each fiats as fiat} <option value={fiat}>{fiat}</option> {/each}
                </select>
            </div>
            <div class="flex-1">
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Crypto Asset</label>
                <select bind:value={selectedCrypto} class="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none">
                    {#each cryptos as crypto} <option value={crypto}>{crypto}</option> {/each}
                </select>
            </div>
        </div>
        <button onclick={scanMarket} disabled={isScanning} class="w-full px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
            {#if isScanning}
                <Activity class="size-5 animate-pulse" /> Scanning Global Liquidity...
            {:else}
                <Search class="size-5" /> Execute Arbitrage Scan
            {/if}
        </button>
    </div>

    {#if hasScanned}
        <div class="max-w-4xl mx-auto space-y-4" in:fly={{ y: 20, duration: 500 }}>
            <h2 class="text-xl font-black text-zinc-900 dark:text-white mb-6">Top Found Routes</h2>
            
            {#if routes.length === 0}
                <div class="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                    <p class="text-zinc-600 dark:text-zinc-400 font-bold">No profitable spreads found for {selectedCrypto}/{selectedFiat} right now.</p>
                    <p class="text-sm mt-2 text-zinc-500">The market is highly efficient today. Try another currency!</p>
                </div>
            {/if}

            <!-- Top Free Routes -->
            {#each routes.slice(0, 3) as route}
                <div class="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5 sm:p-6 shadow-xl shadow-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-transform hover:-translate-y-1">
                    <div class="flex-1 w-full">
                        <div class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Step 1: Buy on {route.buy.exchange}</div>
                        <div class="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                            <div><div class="font-bold text-zinc-900 dark:text-white text-lg">{route.buy.price} <span class="text-xs text-zinc-500">{selectedFiat}</span></div><div class="text-xs text-zinc-500 mt-1">{route.buy.paymentMethods?.[0]?.name || 'Any'}</div></div>
                        </div>
                    </div>
                    <div class="hidden sm:flex flex-col items-center justify-center shrink-0 px-2">
                        <div class="text-emerald-500 font-black text-xl bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50 shadow-sm">+{route.profitPct.toFixed(2)}%</div>
                        <ArrowRight class="size-6 text-zinc-300 dark:text-zinc-600 mt-2" />
                    </div>
                    <div class="flex-1 w-full">
                        <div class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Step 2: Sell on {route.sell.exchange}</div>
                        <div class="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                            <div><div class="font-bold text-zinc-900 dark:text-white text-lg">{route.sell.price} <span class="text-xs text-zinc-500">{selectedFiat}</span></div><div class="text-xs text-zinc-500 mt-1">{route.sell.paymentMethods?.[0]?.name || 'Any'}</div></div>
                        </div>
                    </div>
                </div>
            {/each}

            <!-- Freemium Paywall / Blurred Section -->
            <div class="relative mt-8">
                <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 rounded-b-3xl pb-10">
                    <div class="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-900/30 text-center max-w-md transform hover:scale-105 transition-transform">
                        <span class="text-4xl mb-4 block">🚀</span>
                        <h3 class="text-xl font-black text-zinc-900 dark:text-white mb-2">Unlock {routes.length > 3 ? routes.length - 3 : '10+'} More Routes</h3>
                        <p class="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">Subscribe to P2P Companion Pro to unlock all real-time arbitrage routes, bypass rate limits, and receive automated Telegram alerts.</p>
                        <a href="/pro" class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-black bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                            <Lock class="size-4" /> Go Pro Now
                        </a>
                    </div>
                </div>
                <div class="space-y-4 blur-[6px] opacity-40 pointer-events-none select-none">
                    {#each (routes.length > 3 ? routes.slice(3, 8) : dummyRoutes) as route}
                        <div class="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-6"><div class="flex-1 w-full"><div class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Step 1: Buy on {route.buy.exchange}</div><div class="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl"><div><div class="font-bold text-zinc-900 dark:text-white text-lg">{route.buy.price}</div></div></div></div><div class="hidden sm:flex flex-col items-center justify-center shrink-0 px-2"><div class="text-emerald-500 font-black text-xl">+{route.profitPct.toFixed(2)}%</div></div><div class="flex-1 w-full"><div class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Step 2: Sell on {route.sell.exchange}</div><div class="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl"><div><div class="font-bold text-zinc-900 dark:text-white text-lg">{route.sell.price}</div></div></div></div></div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}

    <article class="max-w-4xl mx-auto prose dark:prose-invert prose-emerald lg:prose-lg mt-24 mb-16">
        <h2>What is Automated P2P Crypto Arbitrage?</h2>
        <p>Peer-to-peer (P2P) crypto arbitrage is the practice of exploiting price inefficiencies between different cryptocurrency exchanges. Because P2P markets are driven by individual merchants rather than automated order books, the spot price of <strong>Tether (USDT)</strong> or <strong>Bitcoin (BTC)</strong> can vary drastically across platforms like Binance, OKX, and Bybit.</p>
        <h3>How Our Arbitrage Scanner Works</h3>
        <p>Our real-time arbitrage scanner aggregates live order books across all major global exchanges. When you initiate a scan, the terminal simultaneously fetches the lowest available "Ask" prices (where you can buy crypto cheaply) and the highest "Bid" prices (where you can sell crypto at a premium). It then calculates the spread, factoring in the exchange and payment method, to deliver a ready-to-execute arbitrage route.</p>
        <div class="bg-zinc-100 dark:bg-zinc-800/80 p-6 rounded-2xl border-l-4 border-emerald-500 not-prose my-8">
            <h4 class="font-bold text-lg text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ShieldAlert class="size-5 text-emerald-500" /> Essential Risk Management</h4>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">While cross-exchange arbitrage offers lucrative opportunities, it carries inherent risks. Always account for <strong>Maker/Taker fees</strong> on the respective exchanges. Furthermore, ensure you have active KYC accounts on both target exchanges, and never release crypto assets until fiat funds have definitively cleared in your local bank account.</p>
        </div>
        
        <h3>The Methodology: Maker vs Taker Execution</h3>
        <p>To successfully capture the spreads shown in our terminal, you must understand how to execute the route. Arbitrage generally relies on dual-liquidity positioning:</p>
        <ul>
            <li><strong>The Taker (Buying):</strong> The first step usually involves finding an unusually cheap "Sell Ad" posted by someone desperate for fiat liquidity. By clicking "Buy", you act as a Taker and instantly capture the cheap USDT.</li>
            <li><strong>The Maker (Selling):</strong> Instead of immediately dumping your USDT to a Taker ad on the secondary exchange, the most profitable route requires you to post your own "Sell Ad" (acting as a Maker) and waiting for retail buyers to accept your high premium.</li>
        </ul>
        <p>This strategy minimizes your exchange fees (Maker fees are typically 0% to 0.1%) and maximizes the total fiat return to your local bank account.</p>
        
        <h3>Understanding the Bid/Ask Spread in P2P</h3>
        <p>In traditional stock markets, the Bid/Ask spread is managed by high-frequency market makers. In the peer-to-peer crypto ecosystem, the spread is dictated by regional bank limits and the capital efficiency of individual merchants.</p>
        <p>Our scanner algorithm constantly polls the highest bid (willing buyers) and lowest ask (willing sellers) across all supported platforms. When the Highest Bid on Exchange A exceeds the Lowest Ask on Exchange B, our system flags it as a positive arbitrage route. It is critical to continuously refresh the scanner, as global liquidity gaps are quickly closed by thousands of other merchants using similar data analytics platforms.</p>

        <h3>Unlocking Institutional Spreads with Pro</h3>
        <p>The free tier of the P2P Companion Arbitrage Finder exposes the top 3 live routes, allowing everyday traders to spot-check market inefficiencies. However, serious merchants leverage <strong>P2P Companion Pro</strong> to unlock the full depth of the order book. Pro users receive unlimited route generation, deep-dive historical spread analytics, and automated Telegram signals the moment a highly profitable gap opens between exchanges.</p>
    </article>
</div>