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
                        <div class="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                                <h1 class="text-3xl font-black text-zinc-900 dark:text-white">Global Market Directory</h1>
                                        <p class="text-zinc-500 mt-2">Select a trading pair below to view specific arbitrage data.</p>
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