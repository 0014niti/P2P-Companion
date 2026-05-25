<script lang="ts">
    // The exact same arrays from your server file
        const fiats = ['NGN', 'TRY', 'ARS', 'USD', 'EUR', 'GBP', 'PHP', 'VND', 'INR', 'RUB', 'BRL', 'ZAR'];
            const cryptos = ['USDT', 'BTC', 'ETH'];
            </script>

            <svelte:head>
                <title>Global Crypto Markets | P2P Terminal</title>
                    <meta name="description" content="Directory of all supported P2P fiat and crypto pairs available for live spread comparison." />
                    </svelte:head>

                    <div class="max-w-screen-xl mx-auto px-4 py-12">
    <div class="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center md:text-left">
        <h1 class="text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">Global Market Directory</h1>
        
        <p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-6 mx-auto md:mx-0">
            Welcome to the P2P Companion Market Directory. Select a trading pair below to access real-time order books, calculate live spreads, and view localized arbitrage data across major cryptocurrency exchanges.
        </p>
        
        <ul class="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center md:justify-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <li class="flex items-center justify-center md:justify-start gap-2">
                <svg class="size-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                50+ Fiat Currencies
            </li>
            <li class="flex items-center justify-center md:justify-start gap-2">
                <svg class="size-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                Live Aggregated Liquidity
            </li>
            <li class="flex items-center justify-center md:justify-start gap-2">
                <svg class="size-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                100% Free Access
            </li>
        </ul>
                                            </div>

                                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {#each cryptos as crypto}
                                                                    <div class="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                                                                    <h2 class="text-xl font-black mb-4 flex items-center gap-2 text-blue-600">
                                                                                                        {crypto} Markets
                                                                                                                        </h2>
                                                                                                                                        <div class="flex flex-wrap gap-2">
                                                                                                                                                            {#each fiats as fiat}
                                                                                                                                                                                    <a href={`/compare/${fiat.toLowerCase()}/${crypto.toLowerCase()}`} class="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 text-xs font-bold rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                                                                                                                                                                                                {crypto}/{fiat}
                                                                                                                                                                                                                                        </a>
                                                                                                                                                                                                                                                            {/each}
                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                {/each}
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                    </div>