<svelte:head>
    <title>What is P2P Crypto Arbitrage? A Complete Guide | P2P Companion</title>
    <meta name="description" content="Learn the fundamentals of Peer-to-Peer (P2P) cryptocurrency arbitrage, how to calculate spreads, and safely trade across Binance, OKX, and Bybit." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-zinc-800 dark:text-zinc-200">
    <!-- Breadcrumb & Back button -->
    <a href="/guides" class="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors mb-8 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800/50">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> 
        Back to Guides
    </a>

    <!-- Header -->
    <header class="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <div class="flex items-center gap-3 mb-6">
            <span class="px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">Trading 101</span>
            <span class="text-zinc-500 text-sm font-medium flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 5 min read</span>
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Mastering P2P Crypto Arbitrage: A Beginner's Guide
        </h1>
        <p class="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Cryptocurrency markets are incredibly volatile, but not all trading relies on predicting whether a coin will go up or down. Enter P2P arbitrage—a strategy focused on exploiting price differences across different platforms.
        </p>
    </header>

    <!-- Article Content -->
    <article class="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
        
        <!-- Quick Summary Box -->
        <div class="not-prose bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 sm:p-8 mb-10">
            <h3 class="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Key Takeaways
            </h3>
            <ul class="space-y-3 text-blue-800 dark:text-blue-200/80 text-base">
                <li class="flex items-start gap-3"><span class="mt-1 text-blue-500">•</span> P2P Arbitrage exploits price differences between different crypto exchanges.</li>
                <li class="flex items-start gap-3"><span class="mt-1 text-blue-500">•</span> Temporary inefficiencies are driven by local fiat demand and payment methods.</li>
                <li class="flex items-start gap-3"><span class="mt-1 text-blue-500">•</span> The golden rule: Never release your crypto before verifying cleared fiat funds in your bank.</li>
            </ul>
        </div>

        <h2>What is P2P Arbitrage?</h2>
        <p>
            Arbitrage is the simultaneous buying and selling of an asset in different markets to profit from a difference in the asset's price. In the context of Peer-to-Peer (P2P) cryptocurrency trading, it involves buying a stablecoin like Tether (USDT) or Bitcoin (BTC) on one exchange where the price is low, and immediately selling it on another exchange (or to a different merchant) where the price is high.
        </p>
        <p>
            Unlike traditional spot markets which are automated and highly efficient, P2P markets are driven by individual merchants and local fiat liquidity. This human element creates temporary inefficiencies (spreads) that savvy traders can capitalize on.
        </p>

        <h2>Why Do Price Differences Exist?</h2>
        <p>Price discrepancies in the P2P market usually occur due to three main factors:</p>
        
        <div class="not-prose grid sm:grid-cols-3 gap-6 my-10">
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <div class="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <span class="text-indigo-600 dark:text-indigo-400 font-black">1</span>
                </div>
                <h4 class="font-bold text-zinc-900 dark:text-white mb-2">Local Fiat Demand</h4>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">In countries with high inflation or strict capital controls, citizens often pay a premium to acquire USD-pegged stablecoins.</p>
            </div>
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <div class="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <span class="text-indigo-600 dark:text-indigo-400 font-black">2</span>
                </div>
                <h4 class="font-bold text-zinc-900 dark:text-white mb-2">Payment Preferences</h4>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">Buyers willingly pay higher prices if a merchant accepts a highly specific, convenient payment method like mobile money.</p>
            </div>
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <div class="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <span class="text-indigo-600 dark:text-indigo-400 font-black">3</span>
                </div>
                <h4 class="font-bold text-zinc-900 dark:text-white mb-2">Exchange Liquidity</h4>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">A massive exchange might have thousands of sellers driving prices down, while a smaller exchange allows sellers to command higher prices.</p>
            </div>
        </div>

        <h2>How to Calculate Your Spread</h2>
        <p>
            Finding an arbitrage opportunity is only the first step; calculating profitability requires attention to detail. The basic formula is straightforward:
        </p>
        
        <div class="not-prose my-8 bg-zinc-900 dark:bg-black rounded-2xl p-6 shadow-xl overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <p class="font-mono text-center text-lg sm:text-xl md:text-2xl text-white relative z-10">
                <span class="text-emerald-400 font-bold">Profit</span> = 
                <span class="text-blue-300">(Sell Price - Buy Price)</span> - 
                <span class="text-rose-400">(Fees)</span>
            </p>
        </div>

        <p>
            This is where tools like the <strong>P2P Companion Terminal</strong> become essential. Instead of opening five different browser tabs and manually doing the math, our terminal aggregates the live order books from Binance, Bybit, OKX, and others. You can instantly see the lowest Ask and the highest Bid across the entire global market.
        </p>

        <hr class="my-10 border-zinc-200 dark:border-zinc-800" />

        <div class="not-prose bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 rounded-r-xl p-6 sm:p-8">
            <h3 class="text-xl font-black text-rose-900 dark:text-rose-400 mb-3 flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                The Golden Rule: Beware of Scams
            </h3>
            <p class="text-rose-800 dark:text-rose-200/80 leading-relaxed text-base">
                While arbitrage can be highly profitable, the P2P space carries inherent risks. The most important rule of P2P trading is to <strong>never release your crypto until you have independently verified that the fiat funds have cleared in your actual bank account</strong>. Do not rely on SMS screenshots, email receipts, or payment proofs provided by the buyer, as these can easily be fabricated.
            </p>
        </div>
    </article>
</div>