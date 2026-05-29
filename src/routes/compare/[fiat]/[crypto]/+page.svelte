<script lang="ts">
    import SeoTextAndFaq from '$lib/components/SeoTextAndFaq.svelte';

    // Extract the dynamic data passed from +page.server.ts
    let { data } = $props();
    const { fiat, crypto, metaTitle, metaDescription, monthYear } = data;
</script>

<svelte:head>
    <title>{metaTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="keywords" content="buy {crypto} with {fiat}, {fiat} {crypto} P2P, {crypto} arbitrage {fiat}, Binance {fiat} P2P, OKX {fiat} crypto, best crypto rates" />
    <link rel="canonical" href="https://p2pcompanion.com/compare/{fiat.toLowerCase()}/{crypto.toLowerCase()}" />

    <!-- Dynamic OpenGraph Overrides -->
    <meta property="og:image" content="https://p2pcompanion.com/api/og?fiat={fiat}&crypto={crypto}" />
    <meta property="twitter:image" content="https://p2pcompanion.com/api/og?fiat={fiat}&crypto={crypto}" />
</svelte:head>

<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 mb-24">
    
    <div class="text-center mb-12 animate-fade-in-up">
        <span class="inline-block px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            Live Market Data Report
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight">
            {crypto} / {fiat} <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600">P2P Spreads & Analysis</span>
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Compare real-time peer-to-peer liquidity for {crypto} using {fiat}. Find the cheapest buying rates and highest selling limits across global centralized exchanges.
        </p>
    </div>

    <div class="max-w-3xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/60 dark:border-zinc-800 rounded-[32px] p-8 lg:p-12 text-center shadow-2xl shadow-slate-200/40 dark:shadow-none mb-16 relative overflow-hidden group">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
        <h2 class="text-2xl font-black mb-4 text-zinc-900 dark:text-white relative z-10">Analyze the full {crypto}/{fiat} Order Book</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 relative z-10">Our terminal aggregates data from Binance, OKX, Bybit, and KuCoin in real-time. 100% Free.</p>
        <a href={`/terminal?fiat=${fiat}&crypto=${crypto}`} class="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] relative z-10">
            Open {crypto}/{fiat} Terminal
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
    </div>

    <article class="max-w-4xl mx-auto prose dark:prose-invert prose-blue lg:prose-lg">
        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-4">Comprehensive Guide to Trading {crypto} with {fiat}</h2>
        
        <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            Navigating the peer-to-peer (P2P) cryptocurrency markets can be complex, especially when looking for the most cost-effective ways to exchange <strong>{fiat}</strong> for <strong>{crypto}</strong>. Because global liquidity is fragmented across multiple centralized exchanges like Binance, Bybit, and OKX, the spot price of {crypto} can vary significantly depending on local banking demands, inflation rates, and regional regulatory environments.
        </p>

        <div class="grid md:grid-cols-2 gap-8 my-10">
            <div class="bg-white/60 dark:bg-zinc-800/60 p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                <h3 class="text-xl font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg text-sm leading-none">🎯</span> Secure the Best Rate
                </h3>
                <ul class="space-y-4 text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed">
                    <li class="flex items-start gap-2.5">
                        <svg class="size-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span><strong>Cross-Reference Liquidity:</strong> Compare Binance, OKX, and Bybit simultaneously instead of relying on a single exchange's order book.</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <svg class="size-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span><strong>Filter Payment Methods:</strong> Check margins specific to your preferred local {fiat} banks or mobile money providers.</span>
                    </li>
                </ul>
            </div>
            <div class="bg-white/60 dark:bg-zinc-800/60 p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                <h3 class="text-xl font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg text-sm leading-none">📈</span> {fiat} Arbitrage Potential
                </h3>
                <p class="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    If you are a P2P merchant, the {fiat} market frequently presents cross-exchange arbitrage gaps. Our tool helps you:
                </p>
                <ul class="space-y-2 text-zinc-700 dark:text-zinc-300 text-[15px]">
                    <li class="flex items-center gap-2">• Identify profitable spread margins.</li>
                    <li class="flex items-center gap-2">• Monitor the lowest Ask vs the highest Bid.</li>
                    <li class="flex items-center gap-2">• Execute informed, risk-managed trades globally.</li>
                </ul>
            </div>
        </div>

        <h3 class="text-xl font-bold text-zinc-900 dark:text-white mb-4">Understanding the {crypto} Premium</h3>
        <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            In many regions, the P2P price of {crypto} trades at a premium compared to the standard global spot rate. This premium is typically driven by high local demand for digital assets as a hedge against local currency depreciation, or by strict capital controls that make traditional foreign exchange difficult. When using our {crypto}/{fiat} terminal, always factor in maker/taker fees and the historical reputation of the merchant you are transacting with to ensure a safe and secure exchange.
        </p>
    </article>

    <SeoTextAndFaq {crypto} {fiat} {monthYear} />
</div>

<style>
    @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
</style>