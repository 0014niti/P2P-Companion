<script lang="ts">
    import { X, Calculator, ArrowRightLeft, TrendingUp, DollarSign } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let {
        isOpen = $bindable(false),
        fiat = 'USD',
        token = 'USDT',
        initialBuyPrice = 0,
        initialSellPrice = 0
    } = $props<{
        isOpen: boolean;
        fiat?: string;
        token?: string;
        initialBuyPrice?: number;
        initialSellPrice?: number;
    }>();

    let investment = $state(1000);
    let buyPrice = $state(initialBuyPrice);
    let sellPrice = $state(initialSellPrice);

    $effect(() => {
        if (isOpen) {
            if (buyPrice === 0) buyPrice = initialBuyPrice;
            if (sellPrice === 0) sellPrice = initialSellPrice;
        }
    });

    function loadAd(node: HTMLElement) {
        setTimeout(() => {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                // Silently ignore if already filled
            }
        }, 350);
    }

    const cryptoAmount = $derived(buyPrice > 0 ? investment / buyPrice : 0);
    const revenue = $derived(cryptoAmount * sellPrice);
    const profit = $derived(revenue - investment);
    const profitMargin = $derived(investment > 0 ? (profit / investment) * 100 : 0);
</script>

{#if isOpen}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4" role="button" tabindex="0" onclick={(e) => { if (e.target === e.currentTarget) isOpen = false; }} onkeydown={(e) => { if (e.key === 'Escape') isOpen = false; }} transition:fade={{ duration: 200 }}>
        <div class="w-full max-w-md max-h-[95vh] rounded-[24px] bg-white/70 backdrop-blur-3xl border border-white/50 shadow-2xl flex flex-col overflow-hidden" transition:fly={{ y: 20, duration: 300, easing: cubicOut }} role="dialog">
            
            <div class="flex items-center justify-between p-5 border-b border-white/50 bg-white/40">
                <div class="flex items-center gap-2.5 text-blue-600">
                    <div class="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/60 shadow-[0_2px_10px_rgba(37,99,235,0.1)]">
                        <Calculator class="size-5" />
                    </div>
                    <h2 class="text-lg font-black text-zinc-900 tracking-tight">Arbitrage Calculator</h2>
                </div>
                <button class="p-2 rounded-full text-zinc-400 hover:bg-white hover:text-zinc-700 transition-all shadow-sm border border-transparent hover:border-zinc-200/60" onclick={() => isOpen = false}>
                    <X class="size-5" />
                </button>
            </div>

                <!-- Calculator Inputs -->
                <div class="space-y-4">
                    <div class="space-y-1.5"><label class="text-[11px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1"><DollarSign class="size-3" /> Investment ({fiat})</label><input type="number" bind:value={investment} class="w-full rounded-xl border border-white/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-sm font-black text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" /></div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1.5"><label class="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Buy Price</label><input type="number" step="0.01" bind:value={buyPrice} class="w-full rounded-xl border border-white/60 bg-white/70 backdrop-blur-sm px-3 py-2.5 text-sm font-black text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" /></div>
                        <div class="space-y-1.5"><label class="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Sell Price</label><input type="number" step="0.01" bind:value={sellPrice} class="w-full rounded-xl border border-white/60 bg-white/70 backdrop-blur-sm px-3 py-2.5 text-sm font-black text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" /></div>
                    </div>
                </div>

                <div class="flex items-center justify-center"><div class="h-8 w-px bg-zinc-200/80"></div><div class="absolute bg-white/80 backdrop-blur-md border border-white p-1.5 rounded-full shadow-sm text-blue-400"><ArrowRightLeft class="size-4" /></div></div>

                <!-- Results -->
                <div class="rounded-2xl border border-blue-100/60 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 p-5 space-y-4 shadow-[inset_0_2px_20px_rgba(255,255,255,0.6)]">
                    <div class="flex justify-between items-center pb-3 border-b border-blue-100/60"><span class="text-xs font-bold text-zinc-500">Crypto Received</span><span class="font-black text-zinc-900">{cryptoAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span class="text-[10px] text-zinc-500">{token}</span></span></div>
                    <div class="flex justify-between items-center pb-3 border-b border-blue-100/60"><span class="text-xs font-bold text-zinc-500">Total Return</span><span class="font-black text-zinc-900">{revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span class="text-[10px] text-zinc-500">{fiat}</span></span></div>
                    <div class="flex justify-between items-end pt-1"><div class="flex flex-col"><span class="text-xs font-bold text-zinc-500 flex items-center gap-1 mb-1"><TrendingUp class="size-3.5" /> Net Profit</span><span class="text-[10px] font-bold {profit > 0 ? 'text-emerald-500' : profit < 0 ? 'text-rose-500' : 'text-zinc-400'}">{profit > 0 ? '+' : ''}{profitMargin.toFixed(2)}% Margin</span></div><span class="text-2xl font-black {profit > 0 ? 'text-emerald-600' : profit < 0 ? 'text-rose-600' : 'text-zinc-800'}">{profit > 0 ? '+' : ''}{profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
                </div>

                <!-- Pro Note -->
                <div class="pt-4 text-center">
                    <span class="inline-block rounded-full bg-indigo-100/50 border border-indigo-200/60 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-500 shadow-sm">
                        ✨ More features coming to <a href="/pro" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-700 hover:underline">Pro Version</a>
                    </span>
                </div>
        </div>
    </div>
{/if}