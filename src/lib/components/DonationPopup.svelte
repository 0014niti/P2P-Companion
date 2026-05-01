<script lang="ts">
    import { Heart, X, Check, Copy } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let { isOpen = $bindable(false) } = $props<{ isOpen: boolean }>();

    let copiedCoin = $state('');

    function copyAddress(address: string, coin: string) {
        navigator.clipboard.writeText(address);
        copiedCoin = coin;
        setTimeout(() => { copiedCoin = ''; }, 2000);
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4" role="button" tabindex="0" onclick={(e) => { if (e.target === e.currentTarget) isOpen = false; }} onkeydown={(e) => { if (e.key === 'Escape') isOpen = false; }} transition:fade={{ duration: 200 }}>
        <div class="w-full max-w-md rounded-[24px] border border-white/40 bg-white/30 backdrop-blur-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]" role="dialog" transition:fly={{ y: 20, duration: 300, easing: cubicOut }}>
            
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-rose-600">
                    <Heart class="size-5 fill-current" />
                    <h3 class="text-xl font-black text-zinc-900">Support the Dev</h3>
                </div>
                <button class="rounded-full p-1.5 text-zinc-500 hover:bg-white/50 hover:text-zinc-900 transition-colors" onclick={() => (isOpen = false)}>
                    <X class="size-5" />
                </button>
            </div>
            
            <p class="text-sm text-zinc-600 mb-6 font-medium leading-relaxed">
                If this terminal helped you capture a profitable spread, consider supporting the server costs to keep it 100% free and ad-light.
            </p>

            <div class="space-y-3">
                <div class="rounded-xl border border-white/50 bg-white/40 p-3 transition-all shadow-sm hover:bg-white/60 hover:border-blue-300/60">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">USDT (TRC20 Network)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 min-w-0 block h-9 leading-9 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white/50 px-2.5 text-xs text-zinc-800 border border-white/60 shadow-inner">TR6EdNsQhXnZ8dRb3dZqveJRPxZftvSyr9</code>
                        <button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/60 border border-white/60 text-zinc-700 hover:bg-white/90 hover:text-zinc-900 transition-all active:scale-95 shadow-sm" onclick={() => copyAddress('TR6EdNsQhXnZ8dRb3dZqveJRPxZftvSyr9', 'USDT')}>
                            {#if copiedCoin === 'USDT'} <Check class="size-4 text-green-500" /> {:else} <Copy class="size-4" /> {/if}
                        </button>
                    </div>
                </div>

                <div class="rounded-xl border border-white/50 bg-white/40 p-3 transition-all shadow-sm hover:bg-white/60 hover:border-orange-300/60">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">Bitcoin (BTC)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 min-w-0 block h-9 leading-9 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white/50 px-2.5 text-xs text-zinc-800 border border-white/60 shadow-inner">YOUR_BTC_ADDRESS</code>
                        <button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/60 border border-white/60 text-zinc-700 hover:bg-white/90 hover:text-zinc-900 transition-all active:scale-95 shadow-sm" onclick={() => copyAddress('YOUR_BTC_ADDRESS', 'BTC')}>
                            {#if copiedCoin === 'BTC'} <Check class="size-4 text-green-500" /> {:else} <Copy class="size-4" /> {/if}
                        </button>
                    </div>
                </div>

                <div class="rounded-xl border border-white/50 bg-white/40 p-3 transition-all shadow-sm hover:bg-white/60 hover:border-zinc-400/60">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">Ripple (XRP)</span>
                        <span class="text-[9px] font-bold text-rose-600 bg-rose-50/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-rose-200/60">Include Memo if required</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 min-w-0 block h-9 leading-9 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white/50 px-2.5 text-xs text-zinc-800 border border-white/60 shadow-inner">YOUR_XRP_ADDRESS</code>
                        <button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/60 border border-white/60 text-zinc-700 hover:bg-white/90 hover:text-zinc-900 transition-all active:scale-95 shadow-sm" onclick={() => copyAddress('YOUR_XRP_ADDRESS', 'XRP')}>
                            {#if copiedCoin === 'XRP'} <Check class="size-4 text-green-500" /> {:else} <Copy class="size-4" /> {/if}
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
                <div class="flex-1 h-px bg-zinc-200/60"></div>
                <span class="text-xs font-bold text-zinc-500">OR</span>
                <div class="flex-1 h-px bg-zinc-200/60"></div>
            </div>

            <a href="https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_ID" target="_blank" rel="noopener noreferrer" class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00457C] hover:bg-[#003057] text-white px-4 py-3 text-sm font-black transition-all active:scale-95 shadow-lg">
                Donate with PayPal
            </a>
        </div>
    </div>
{/if}