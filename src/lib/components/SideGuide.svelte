<script lang="ts">
    import { BookOpen, Map, Info, X, CheckCircle2, ChevronRight } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';

    // Svelte 5 Runes for state management
    let isOpen = $state(false);
    let activeTab = $state<'notes' | 'roadmap'>('notes');

    function togglePanel() {
        isOpen = !isOpen;
    }
</script>

{#if !isOpen}
    <button 
        onclick={togglePanel}
        class="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-primary-foreground p-3 rounded-l-xl shadow-2xl flex flex-col items-center gap-2 hover:bg-primary/90 transition-all border border-r-0 border-border group"
        in:fly={{ x: 50, duration: 300 }}
    >
        <div class="flex flex-col items-center gap-2">
            <Info class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span class="text-[11px] uppercase font-bold tracking-widest writing-vertical-lr rotate-180 pb-1">
                Guide
            </span>
        </div>
    </button>
{/if}

{#if isOpen}
    <button
        class="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60] transition-opacity w-full h-full cursor-default"
        onclick={togglePanel}
        aria-label="Close Panel"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
    ></button>

    <div 
        class="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-[70] flex flex-col"
        in:fly={{ x: '100%', duration: 300, opacity: 1 }}
        out:fly={{ x: '100%', duration: 300, opacity: 1 }}
    >
        <div class="flex items-center justify-between p-6 border-b border-border bg-muted/30">
            <h2 class="text-xl font-bold flex items-center gap-2 text-foreground">
                <BookOpen class="w-5 h-5 text-primary" /> 
                Scanner Companion
            </h2>
            <button 
                onclick={togglePanel}
                class="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <div class="flex p-4 gap-2 border-b border-border bg-background/50">
            <button 
                onclick={() => activeTab = 'notes'}
                class="flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all {activeTab === 'notes' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground'}"
            >
                <Info class="w-4 h-4" /> How to Use
            </button>
            <button 
                onclick={() => activeTab = 'roadmap'}
                class="flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all {activeTab === 'roadmap' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground'}"
            >
                <Map class="w-4 h-4" /> Roadmap
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
            {#if activeTab === 'notes'}
                <div in:fade={{ duration: 200, delay: 150 }} class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2 text-foreground">Mastering the Scanner</h3>
                        <p class="text-muted-foreground text-sm mb-4">
                            Find the best crypto arbitrage opportunities across multiple exchanges in real-time.
                        </p>
                    </div>
                    
                    <ul class="space-y-5">
                        <li class="flex items-start gap-3">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">1. Configure Your Search</p>
                                <p class="text-xs text-muted-foreground mt-1">Use the top filters to choose your target cryptocurrency (e.g., USDT) and local fiat currency.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">2. Set Target Amount</p>
                                <p class="text-xs text-muted-foreground mt-1">Input the exact fiat amount to automatically filter out merchants whose trading limits don't match your needs.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">3. Spot the Spread</p>
                                <p class="text-xs text-muted-foreground mt-1">Analyze the comparison cards to identify price differences. Buy low on one exchange and sell high on another.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">4. Refresh Strategically</p>
                                <p class="text-xs text-muted-foreground mt-1">P2P markets move fast. Use the refresh button to pull the latest live order book data directly from our Edge network.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            {:else}
                <div in:fade={{ duration: 200, delay: 150 }} class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2 text-foreground">What's Next?</h3>
                        <p class="text-muted-foreground text-sm mb-6">
                            Our vision for the future of the P2P Companion.
                        </p>
                    </div>

                    <div class="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                        
                        <div class="relative pl-6">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 1: Foundation (Current)</h4>
                            <ul class="mt-2 space-y-2 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3 text-primary" /> Real-time price aggregator</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3 text-primary" /> Multi-exchange integrations</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3 text-primary" /> Global Edge runtime optimization</li>
                            </ul>
                        </div>

                        <div class="relative pl-6 opacity-70">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 2: Smart Analytics</h4>
                            <ul class="mt-2 space-y-2 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Automated Spread Calculator</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Trusted Merchant filtering</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Historic price trend graphs</li>
                            </ul>
                        </div>

                        <div class="relative pl-6 opacity-50">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 3: Automation</h4>
                            <ul class="mt-2 space-y-2 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Live push notifications via PWA</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Custom target price alerts</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Saved custom user profiles</li>
                            </ul>
                        </div>

                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* Utility class to rotate text vertically for the side button */
    .writing-vertical-lr {
        writing-mode: vertical-lr;
    }
</style>