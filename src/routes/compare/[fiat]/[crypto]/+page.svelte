<script lang="ts">
    // Extract the dynamic data passed from +page.server.ts
    let { data } = $props();
    const { fiat, crypto, metaTitle, metaDescription } = data;
</script>

<svelte:head>
    <title>{metaTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="keywords" content="buy {crypto} with {fiat}, {fiat} {crypto} P2P, {crypto} arbitrage {fiat}, Binance {fiat} P2P, OKX {fiat} crypto, best crypto rates" />
    <link rel="canonical" href="https://p2pcompanion.com/compare/{fiat.toLowerCase()}/{crypto.toLowerCase()}" />
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
            <div class="bg-white/40 dark:bg-zinc-800/40 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
                <h3 class="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-3">How to secure the best {crypto} rate</h3>
                <p class="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Buying {crypto} on a single exchange often means you are missing out on hidden liquidity. By utilizing an aggregator, you can filter by your preferred local {fiat} payment methods (such as bank transfers or mobile money wallets) to cross-reference the lowest possible entry price across the entire market simultaneously.
                </p>
            </div>
            <div class="bg-white/40 dark:bg-zinc-800/40 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
                <h3 class="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-3">Arbitrage Opportunities for {fiat}</h3>
                <p class="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    If you are a P2P merchant, the {fiat} market frequently presents cross-exchange arbitrage gaps. By continuously monitoring the spread between the lowest ask (buying price) on one exchange and the highest bid (selling price) on another, merchants can identify highly profitable margins and execute risk-managed trades.
                </p>
            </div>
        </div>

        <h3 class="text-xl font-bold text-zinc-900 dark:text-white mb-4">Understanding the {crypto} Premium</h3>
        <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            In many regions, the P2P price of {crypto} trades at a premium compared to the standard global spot rate. This premium is typically driven by high local demand for digital assets as a hedge against local currency depreciation, or by strict capital controls that make traditional foreign exchange difficult. When using our {crypto}/{fiat} terminal, always factor in maker/taker fees and the historical reputation of the merchant you are transacting with to ensure a safe and secure exchange.
        </p>
    </article>
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