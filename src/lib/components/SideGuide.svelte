<script lang="ts">
    import { BookOpen, Map, Info, X, CheckCircle2, ChevronRight, HeartHandshake, Mail, MessageSquare } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
    import { cubicOut, cubicIn } from 'svelte/easing';

    // Svelte 5 Runes
    let isOpen = $state(false);
    let activeTab = $state<'notes' | 'roadmap' | 'support'>('notes');

    function togglePanel() {
        isOpen = !isOpen;
    }
</script>

{#if !isOpen}
    <button 
        onclick={togglePanel}
        class="fixed right-0 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-l-2xl flex flex-col items-center gap-2 group transition-all duration-500 ease-out
               bg-background/40 backdrop-blur-md border border-r-0 border-white/20 dark:border-white/10 
               shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.3)] 
               hover:bg-background/60 hover:pr-4"
        in:fly={{ x: 50, duration: 500, delay: 200, easing: cubicOut }}
    >
        <div class="relative flex flex-col items-center">
            <div class="absolute top-0 w-6 h-6 bg-primary/40 rounded-full blur-md animate-pulse group-hover:bg-primary/60 transition-colors"></div>
            
            <Info class="w-5 h-5 text-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
            
            <span class="text-[10px] text-foreground uppercase font-bold tracking-[0.2em] writing-vertical-lr rotate-180 pb-1 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                Guide
            </span>
        </div>
    </button>
{/if}

{#if isOpen}
    <button
        class="fixed inset-0 bg-background/40 backdrop-blur-sm z-[60] transition-opacity w-full h-full cursor-default"
        onclick={togglePanel}
        aria-label="Close Panel"
        in:fade={{ duration: 300, easing: cubicOut }}
        out:fade={{ duration: 200, easing: cubicIn }}
    ></button>

    <div 
        class="fixed right-0 top-0 h-full w-full sm:w-[420px] z-[70] flex flex-col
               bg-background/80 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 shadow-2xl"
        in:fly={{ x: '100%', duration: 400, opacity: 1, easing: cubicOut }}
        out:fly={{ x: '100%', duration: 300, opacity: 1, easing: cubicIn }}
    >
        <div class="flex items-center justify-between p-6 border-b border-white/10 bg-muted/20">
            <h2 class="text-xl font-bold flex items-center gap-2 text-foreground">
                <BookOpen class="w-5 h-5 text-primary" /> 
                Companion Guide
            </h2>
            <button 
                onclick={togglePanel}
                class="p-2 bg-background/50 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-white/10"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <div class="flex p-3 gap-2 border-b border-white/10 bg-background/30 backdrop-blur-md">
            <button 
                onclick={() => activeTab = 'notes'}
                class="flex-1 py-2 px-1 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all duration-300
                {activeTab === 'notes' ? 'bg-primary/15 text-primary shadow-sm border border-primary/20' : 'hover:bg-muted/50 text-muted-foreground border border-transparent'}"
            >
                <Info class="w-4 h-4" /> Usage
            </button>
            
            <button 
                onclick={() => activeTab = 'roadmap'}
                class="flex-1 py-2 px-1 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all duration-300
                {activeTab === 'roadmap' ? 'bg-primary/15 text-primary shadow-sm border border-primary/20' : 'hover:bg-muted/50 text-muted-foreground border border-transparent'}"
            >
                <Map class="w-4 h-4" /> Roadmap
            </button>

            <button 
                onclick={() => activeTab = 'support'}
                class="flex-1 py-2 px-1 rounded-xl font-medium text-xs flex flex-col items-center gap-1 transition-all duration-300
                {activeTab === 'support' ? 'bg-primary/15 text-primary shadow-sm border border-primary/20' : 'hover:bg-muted/50 text-muted-foreground border border-transparent'}"
            >
                <HeartHandshake class="w-4 h-4" /> Support
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {#if activeTab === 'notes'}
                <div in:fade={{ duration: 200, delay: 100 }} class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2 text-foreground">Mastering the Scanner</h3>
                        <p class="text-muted-foreground text-sm mb-4">
                            Find the best crypto arbitrage opportunities across multiple exchanges in real-time.
                        </p>
                    </div>
                    
                    <ul class="space-y-5">
                        <li class="flex items-start gap-3 group">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">1. Configure Your Search</p>
                                <p class="text-xs text-muted-foreground mt-1 leading-relaxed">Use the top filters to choose your target cryptocurrency (e.g., USDT) and local fiat currency.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3 group">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">2. Set Target Amount</p>
                                <p class="text-xs text-muted-foreground mt-1 leading-relaxed">Input the exact fiat amount to filter out merchants whose trading limits don't match your needs.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3 group">
                            <div class="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">3. Spot the Spread</p>
                                <p class="text-xs text-muted-foreground mt-1 leading-relaxed">Analyze the comparison cards to identify price differences. Buy low on one exchange, sell high on another.</p>
                            </div>
                        </li>
                    </ul>
                </div>

            {:else if activeTab === 'roadmap'}
                <div in:fade={{ duration: 200, delay: 100 }} class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2 text-foreground">What's Next?</h3>
                        <p class="text-muted-foreground text-sm mb-6">Our vision for the future of the P2P Companion.</p>
                    </div>
                    <div class="relative border-l-2 border-white/10 ml-3 space-y-8 pb-4">
                        <div class="relative pl-6">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 1: Foundation (Live)</h4>
                            <ul class="mt-2 space-y-2 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3 text-primary" /> Multi-exchange integrations</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3 text-primary" /> Global Edge runtime</li>
                            </ul>
                        </div>
                        <div class="relative pl-6 opacity-70 hover:opacity-100 transition-opacity">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 2: Smart Analytics</h4>
                            <ul class="mt-2 space-y-2 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Automated Spread Calculator</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Historic price trend graphs</li>
                            </ul>
                        </div>
                    </div>
                </div>

            {:else if activeTab === 'support'}
                <div in:fade={{ duration: 200, delay: 100 }} class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2 text-foreground">We're here to help!</h3>
                        <p class="text-muted-foreground text-sm mb-6">
                            Running into issues or have a feature request? Reach out to us or help support the project's development.
                        </p>
                    </div>
                    
                    <div class="space-y-4">
                        <a href="mailto:your-email@example.com" class="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group">
                            <div class="bg-primary/10 p-3 rounded-full text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                <Mail class="w-5 h-5" />
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Email Support</h4>
                                <p class="text-xs text-muted-foreground mt-0.5">Drop us a line anytime.</p>
                            </div>
                        </a>

                        <a href="https://github.com/your-github/p2p-companion/issues" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group">
                            <div class="bg-primary/10 p-3 rounded-full text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                <MessageSquare class="w-5 h-5" />
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Report a Bug</h4>
                                <p class="text-xs text-muted-foreground mt-0.5">Open an issue on GitHub.</p>
                            </div>
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .writing-vertical-lr {
        writing-mode: vertical-lr;
    }
    
    /* Clean up the scrollbar to make it fit the glassy theme */
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.3);
        border-radius: 20px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.5);
    }
</style>