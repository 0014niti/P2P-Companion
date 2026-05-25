<script lang="ts">
    let { data } = $props();
    const { fiat, fiatName, metaTitle, metaDescription, monthYear } = data;

    const cryptos = ['USDT', 'BTC', 'ETH'];
</script>

<svelte:head>
    <title>{metaTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="keywords" content="{fiatName} crypto, {fiat} P2P market, buy USDT with {fiat}, {fiat} crypto arbitrage" />
    <link rel="canonical" href="https://p2pcompanion.com/fiat/{fiat.toLowerCase()}" />
</svelte:head>

<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 mb-24">
    <div class="text-center mb-16 animate-fade-in-up">
        <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
            Regional Fiat Dashboard
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight">
            The State of <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{fiatName}</span>
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Your central hub for exploring the <strong>{fiat}</strong> peer-to-peer cryptocurrency market. Discover active liquidity, premium rates, and the best ways to exchange {fiat} locally.
        </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid sm:grid-cols-3 gap-6 mb-16">
        <div class="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center shadow-sm">
            <h3 class="text-zinc-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-wider mb-2">Fiat Currency</h3>
            <div class="text-3xl font-black text-zinc-900 dark:text-white">{fiat}</div>
            <p class="text-sm text-zinc-500 mt-2">{fiatName}</p>
        </div>
        <div class="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center shadow-sm">
            <h3 class="text-zinc-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-wider mb-2">Tracked Exchanges</h3>
            <div class="text-3xl font-black text-zinc-900 dark:text-white">6+</div>
            <p class="text-sm text-zinc-500 mt-2">Binance, Bybit, OKX...</p>
        </div>
        <div class="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center shadow-sm">
            <h3 class="text-zinc-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-wider mb-2">Status</h3>
            <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex justify-center items-center gap-2">
                <span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
                Live
            </div>
            <p class="text-sm text-zinc-500 mt-2">Real-time Order Books</p>
        </div>
    </div>

    <!-- Top Markets -->
    <div class="mb-16">
        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-8 text-center">Most Active {fiat} Markets</h2>
        <div class="grid md:grid-cols-3 gap-6">
            {#each cryptos as crypto}
                <a href="/compare/{fiat.toLowerCase()}/{crypto.toLowerCase()}" class="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 block">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 font-bold text-sm">
                                {crypto.substring(0, 3)}
                            </div>
                            <span class="font-black text-lg text-zinc-900 dark:text-white">{crypto} / {fiat}</span>
                        </div>
                        <svg class="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400">Compare spreads and find arbitrage opportunities for {crypto} using {fiatName}.</p>
                </a>
            {/each}
        </div>
    </div>

    <!-- Terminal CTA -->
    <div class="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-[32px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden mb-16">
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <h2 class="text-3xl font-black text-white mb-4 relative z-10">Scan {fiat} Liquidity Instantly</h2>
        <p class="text-zinc-400 mb-8 max-w-xl mx-auto relative z-10 text-lg">
            Launch our free data terminal to analyze real-time {fiat} order books across global exchanges without creating an account.
        </p>
        <a href={`/terminal?fiat=${fiat}`} class="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 relative z-10">
            Open {fiat} Terminal
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
    </div>
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