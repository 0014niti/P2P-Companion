<script lang="ts">
    import { onMount } from 'svelte';
    import { Lock, ArrowRight, BarChart3, Bot, AlertTriangle, Heart } from 'lucide-svelte';
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
        // Check if user is already authenticated in this session
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
            // Shake animation on error
            const form = document.getElementById('login-form');
            form?.classList.add('animate-shake');
            setTimeout(() => form?.classList.remove('animate-shake'), 500);
        }
    }
</script>

<svelte:head>
    <title>Pro Analytics | P2P Terminal</title>
    <meta name="robots" content="noindex, nofollow" />
    <style>
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    </style>
</svelte:head>

{#if !isAuthenticated}
    <!-- LOCK SCREEN -->
    <div class="flex min-h-screen items-center justify-center p-4" transition:fly={{ y: 20, duration: 500 }}>
        <div id="login-form" class="w-full max-w-sm">
            <div class="flex flex-col items-center text-center mb-8">
                <div class="flex items-center justify-center size-16 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4">
                    <Lock class="size-8 text-blue-400" />
                </div>
                <h1 class="text-3xl font-black text-white tracking-tight">Pro Access</h1>
                <p class="text-zinc-400 mt-1">Enter your access code to continue.</p>
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
            
            <div class="text-center mt-8">
                 <a href="/scanner" class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Back to Free Scanner</a>
            </div>
        </div>
    </div>
{:else}
    <!-- PREMIUM ANALYTICS PAGE -->
    <main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 text-white" transition:fly={{ y: 20, duration: 500 }}>
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <h1 class="text-4xl font-black tracking-tighter text-white">
                    Premium Analytics
                </h1>
                <p class="text-zinc-400 mt-1">Curated data signals & historical spread analysis.</p>
            </div>
            <a href="/scanner" class="mt-4 sm:mt-0 text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                &larr; Back to Scanner
            </a>
        </header>

        <!-- Under Construction & Support Notice -->
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

        <!-- Mock Data UI -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Arbitrage Signal -->
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

            <!-- Historical Chart -->
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
