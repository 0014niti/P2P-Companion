<script lang="ts">
    import { onMount } from 'svelte';
    import { Lock, ArrowRight, BarChart3, Bot, AlertTriangle, Heart, Zap, LineChart, Shield } from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    // --- Config ---
    const ACCESS_CODE = 'BETA_WHALE_2024'; // The secret passcode
    const SESSION_KEY = 'pro_access_granted';

    // --- State ---
    let isAuthenticated = $state(false);
    let enteredCode = $state('');
    let errorMessage = $state('');

    // --- Lifecycle ---
    onMount(() => {
        if (sessionStorage.getItem(SESSION_KEY) === 'true') {
            isAuthenticated = true;
        }
    });

    // --- Logic ---
    function handleLogin() {
        if (enteredCode === ACCESS_CODE) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            isAuthenticated = true;
            errorMessage = '';
        } else {
            errorMessage = 'Invalid Access Code.';
            const form = document.getElementById('login-form');
            form?.classList.add('animate-shake');
            setTimeout(() => form?.classList.remove('animate-shake'), 500);
        }
    }
</script>

<svelte:head>
    <title>Pro Analytics & Arbitrage Tools | P2P Terminal</title>
    <meta name="description" content="Unlock advanced peer-to-peer crypto arbitrage tools, historical spread analysis, and automated market signals with P2P Companion Pro." />
    <style>
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    </style>
</svelte:head>

{#if !isAuthenticated}
    <div class="mx-auto max-w-screen-xl px-4 py-12 lg:py-20" transition:fly={{ y: 20, duration: 500 }}>
        <div class="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div id="login-form" class="w-full max-w-md mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
                <div class="flex flex-col items-center text-center mb-8">
                    <div class="flex items-center justify-center size-16 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4">
                        <Lock class="size-8 text-blue-400" />
                    </div>
                    <h2 class="text-3xl font-black text-white tracking-tight">Pro Access</h2>
                    <p class="text-zinc-400 mt-2">Enter your beta access code to continue.</p>
                </div>

                <form on:submit|preventDefault={handleLogin} class="space-y-4">
                    <input
                        bind:value={enteredCode}
                        type="password"
                        placeholder="••••••••••••"
                        class="block w-full rounded-xl border-2 bg-zinc-800/50 px-5 py-3.5 text-center text-lg font-bold text-white tracking-widest border-zinc-700/80 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none"
                    />
                    <button type="submit" class="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-base font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-95">
                        Unlock Analytics
                        <ArrowRight class="size-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                {#if errorMessage}
                    <p class="mt-4 text-center text-sm font-bold text-rose-500">{errorMessage}</p>
                {/if}
            </div>

            <div class="text-zinc-300">
                <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Advanced Tools for <span class="text-blue-500">P2P Merchants</span></h1>
                <p class="text-lg leading-relaxed mb-6">
                    P2P Companion Pro is designed for high-volume cryptocurrency merchants and institutional traders who require split-second market intelligence. While our free terminal provides excellent spot-checks, Pro users gain access to our deep-data pipeline.
                </p>
                <p class="text-lg leading-relaxed mb-8">
                    Stop manually refreshing exchange order books. Our automated systems track liquidity depth, calculate cross-exchange maker/taker fees in real-time, and identify fleeting arbitrage opportunities across fiat markets globally.
                </p>
                <div class="flex gap-4">
                    <a href="/terminal" class="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors">Try Free Terminal</a>
                </div>
            </div>
        </div>

        <div class="border-t border-zinc-800 pt-16">
            <h2 class="text-3xl font-black text-center text-white mb-12">Why Upgrade to Pro?</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
                    <Zap class="size-8 text-amber-400 mb-4" />
                    <h3 class="text-xl font-bold text-white mb-3">Live Arbitrage Signals</h3>
                    <p class="text-zinc-400 leading-relaxed">Receive instant algorithmic alerts when a profitable spread opens between major exchanges like Binance, Bybit, and OKX. Our system calculates net profit margins after standard maker fees.</p>
                </div>
                <div class="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
                    <LineChart class="size-8 text-blue-400 mb-4" />
                    <h3 class="text-xl font-bold text-white mb-3">Historical Spread Charts</h3>
                    <p class="text-zinc-400 leading-relaxed">Visualize premium fluctuations over time. Analyze historical fiat-to-crypto premiums to predict market trends during local banking hours or macroeconomic news events.</p>
                </div>
                <div class="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
                    <Shield class="size-8 text-emerald-400 mb-4" />
                    <h3 class="text-xl font-bold text-white mb-3">Deep Order Book Access</h3>
                    <p class="text-zinc-400 leading-relaxed">Go beyond the first page of advertisements. Pro allows you to analyze massive liquidity walls and identify large institutional orders that might move the local P2P peg.</p>
                </div>
            </div>
        </div>
    </div>

{:else}
    <main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 text-white" transition:fly={{ y: 20, duration: 500 }}>
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <h1 class="text-4xl font-black tracking-tighter text-white">Premium Analytics</h1>
                <p class="text-zinc-400 mt-1">Curated data signals & historical spread analysis.</p>
            </div>
            <a href="/terminal" class="mt-4 sm:mt-0 text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                &larr; Back to Terminal
            </a>
        </header>

        <div class="mb-8 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex-shrink-0 size-10 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                <AlertTriangle class="size-5 text-amber-400" />
            </div>
            <div class="flex-grow">
                <h3 class="font-bold text-amber-300">This Section is Under Construction</h3>
                <p class="text-sm text-amber-400/80 mt-1 leading-relaxed">
                    The V2 analytics engine is currently in active development. The UI below uses mock data. Your support helps accelerate the release of live charting and arbitrage signals.
                </p>
            </div>
            <a href="https://www.buymeacoffee.com/dr.n" target="_blank" rel="noopener noreferrer" class="group flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-black text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95">
                <Heart class="size-4 fill-white" />
                Support the Dev
            </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-4">
                <div class="flex items-center gap-2">
                    <Bot class="size-5 text-blue-400" />
                    <h2 class="text-lg font-bold text-zinc-200">Arbitrage Signal</h2>
                </div>
                <div class="rounded-xl bg-zinc-800 p-4 border border-zinc-700">
                    <p class="text-xs font-bold uppercase tracking-widest text-emerald-400">🔥 +2.4% Spread Detected</p>
                    <p class="text-2xl font-black text-white mt-2">Buy on Bybit, Sell on Binance</p>
                    <div class="mt-4 space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-zinc-400">Buy Price (Bybit):</span>
                            <span class="font-bold text-white tabular-nums">1,150.25 NGN</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-zinc-400">Sell Price (Binance):</span>
                            <span class="font-bold text-white tabular-nums">1,178.10 NGN</span>
                        </div>
                    </div>
                </div>
                <p class="text-xs text-zinc-500 italic">Live signal detection coming in V2. This is mock data.</p>
            </div>

            <div class="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-4">
                <div class="flex items-center gap-2">
                    <BarChart3 class="size-5 text-blue-400" />
                    <h2 class="text-lg font-bold text-zinc-200">Historical Spread (USDT/NGN)</h2>
                </div>
                <div class="h-64 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <p class="text-zinc-500 font-medium">Chart component placeholder</p>
                </div>
                <p class="text-xs text-zinc-500 italic">Historical data ingestion and charting coming in V2. This is a UI placeholder.</p>
            </div>
        </div>
    </main>
{/if}