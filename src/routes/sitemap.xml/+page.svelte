<script lang="ts">
    let { data } = $props();
    const { fiat, crypto, paymentSlug, paymentTitle, metaTitle, metaDescription, monthYear } = data;
</script>

<svelte:head>
    <title>{metaTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="keywords" content="buy {crypto} with {paymentTitle}, {paymentTitle} {crypto} P2P, {crypto} arbitrage {fiat}, Binance {paymentTitle} P2P" />
    <link rel="canonical" href="https://p2pcompanion.com/compare/{fiat.toLowerCase()}/{crypto.toLowerCase()}/{paymentSlug}" />
</svelte:head>

<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 mb-24">
    
    <div class="text-center mb-12 animate-fade-in-up">
        <span class="inline-block px-4 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
            Payment Method Analytics
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight">
            Buy {crypto} with <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600">{paymentTitle}</span>
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Compare real-time peer-to-peer liquidity for {crypto} using <strong>{paymentTitle}</strong> in {fiat}. Find the cheapest buying rates and lowest fees across global centralized exchanges.
        </p>
    </div>

    <div class="max-w-3xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/60 dark:border-zinc-800 rounded-[32px] p-8 lg:p-12 text-center shadow-2xl shadow-slate-200/40 dark:shadow-none mb-16 relative overflow-hidden group">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
        <h2 class="text-2xl font-black mb-4 text-zinc-900 dark:text-white relative z-10">Scan the {crypto} market for {paymentTitle}</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 relative z-10">Our terminal filters out noise to show you exactly which merchants accept {paymentTitle} on Binance, OKX, and Bybit.</p>
        <a href={`/terminal?fiat=${fiat}&crypto=${crypto}&payment=${paymentSlug}`} class="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] relative z-10">
            Open P2P Terminal
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
    </div>

    <article class="max-w-4xl mx-auto prose dark:prose-invert prose-indigo lg:prose-lg">
        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-4">Trading {crypto} using {paymentTitle}</h2>
        
        <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            When exchanging <strong>{fiat}</strong> for <strong>{crypto}</strong>, the payment method you choose drastically impacts the final price you pay. Merchants who accept <strong>{paymentTitle}</strong> may charge a premium due to processing fees, chargeback risks, or simply the convenience it offers.
        </p>

        <div class="grid md:grid-cols-2 gap-8 my-10">
            <div class="bg-white/60 dark:bg-zinc-800/60 p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                <h3 class="text-xl font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg text-sm leading-none">🔍</span> Compare Fees
                </h3>
                <p class="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Some exchanges have better liquidity for specific payment types. For instance, while Binance might have hundreds of merchants accepting {paymentTitle}, OKX or Bybit might have a merchant offering a much tighter spread. Always cross-reference.
                </p>
            </div>
            <div class="bg-white/60 dark:bg-zinc-800/60 p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                <h3 class="text-xl font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg text-sm leading-none">🛡️</span> Trade Safely
                </h3>
                <p class="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    When using {paymentTitle}, ensure your account name matches your exchange KYC details. Third-party transfers are almost universally banned on P2P platforms and can result in frozen funds.
                </p>
            </div>
        </div>
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