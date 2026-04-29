<script lang="ts">
    import { BookOpen, Map, Info, X, CheckCircle2, ChevronRight, HeartHandshake, Mail, MessageSquare, Sparkles, Coffee, Wallet } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';
    import { backOut, expoOut } from 'svelte/easing';

    // 🌟 FIX: Made isOpen a bindable prop so the Dock can control it!
    let { isOpen = $bindable(false), onDonateClick } = $props();
    
    let activeTab = $state<'notes' | 'roadmap' | 'support'>('notes');

    function closePanel() {
        isOpen = false;
    }

    function handleDonate() {
        isOpen = false;
        if (onDonateClick) {
            onDonateClick();
        }
    }
</script>

{#if isOpen}
    <button
        class="fixed inset-0 bg-background/20 backdrop-blur-[2px] z-[60] w-full h-full cursor-default"
        onclick={closePanel}
        aria-label="Close Panel"
        in:fade={{ duration: 300, easing: expoOut }}
        out:fade={{ duration: 200 }}
    ></button>

    <div 
        class="fixed right-4 sm:right-6 bottom-24 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[75vh] z-[70] flex flex-col rounded-3xl overflow-hidden
               bg-background/60 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]"
        in:scale={{ start: 0.9, duration: 400, opacity: 0, easing: backOut }}
        out:scale={{ start: 0.95, duration: 200, opacity: 0 }}
    >
        <div class="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <h2 class="text-lg font-bold flex items-center gap-2 text-foreground">
                <BookOpen class="w-5 h-5 text-primary" /> 
                Companion Guide
            </h2>
            <button 
                onclick={closePanel}
                class="p-2 bg-background/50 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground hover:rotate-90 duration-300"
            >
                <X class="w-4 h-4" />
            </button>
        </div>

        <div class="p-3 bg-white/5">
            <div class="flex p-1 bg-background/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <button 
                    onclick={() => activeTab = 'notes'}
                    class="flex-1 py-1.5 px-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-300
                    {activeTab === 'notes' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}"
                >
                    <Info class="w-3.5 h-3.5" /> Usage
                </button>
                <button 
                    onclick={() => activeTab = 'roadmap'}
                    class="flex-1 py-1.5 px-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-300
                    {activeTab === 'roadmap' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}"
                >
                    <Map class="w-3.5 h-3.5" /> Roadmap
                </button>
                <button 
                    onclick={() => activeTab = 'support'}
                    class="flex-1 py-1.5 px-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-300
                    {activeTab === 'support' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}"
                >
                    <HeartHandshake class="w-3.5 h-3.5" /> Support
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 scrollbar-none">
            {#if activeTab === 'notes'}
                <div in:fade={{ duration: 200 }} class="space-y-5">
                    <div>
                        <h3 class="font-semibold text-foreground">How it works</h3>
                        <p class="text-muted-foreground text-xs mt-1">
                            Find the best crypto arbitrage opportunities across multiple exchanges in real-time.
                        </p>
                    </div>
                    
                    <ul class="space-y-4">
                        <li class="flex items-start gap-3 group">
                            <div class="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">1. Configure Search</p>
                                <p class="text-xs text-muted-foreground mt-0.5">Choose your target crypto and fiat.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3 group">
                            <div class="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">2. Set Target Amount</p>
                                <p class="text-xs text-muted-foreground mt-0.5">Filter by merchant trading limits.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3 group">
                            <div class="bg-primary/10 p-1.5 rounded-full text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                <CheckCircle2 class="w-4 h-4" />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-foreground">3. Spot the Spread</p>
                                <p class="text-xs text-muted-foreground mt-0.5">Buy low on one exchange, sell high on another.</p>
                            </div>
                        </li>
                    </ul>
                </div>

            {:else if activeTab === 'roadmap'}
                <div in:fade={{ duration: 200 }} class="space-y-6">
                    <div>
                        <h3 class="font-semibold text-foreground">Building the Future</h3>
                        <p class="text-muted-foreground text-xs mt-1">Help us unlock these upcoming features!</p>
                    </div>
                    
                    <div class="relative border-l-2 border-white/10 ml-3 space-y-6 pb-2">
                        <div class="relative pl-5">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 1: Foundation</h4>
                            <p class="text-[11px] text-primary mt-1">Live Now</p>
                        </div>
                        
                        <div class="relative pl-5 opacity-80 hover:opacity-100 transition-opacity">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 2: Smart Analytics</h4>
                            <ul class="mt-1 space-y-1 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Automated Spread Calculator</li>
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Visual trend graphs</li>
                            </ul>
                        </div>
                        
                        <div class="relative pl-5 opacity-60 hover:opacity-100 transition-opacity">
                            <span class="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background"></span>
                            <h4 class="font-bold text-sm text-foreground">Phase 3: Automation</h4>
                            <ul class="mt-1 space-y-1 text-xs text-muted-foreground">
                                <li class="flex items-center gap-1"><ChevronRight class="w-3 h-3" /> Price alert notifications</li>
                            </ul>
                        </div>
                    </div>
                    
                    <button 
                        onclick={() => activeTab = 'support'}
                        class="w-full mt-4 py-2 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                    >
                        Fuel the roadmap <ChevronRight class="w-3 h-3" />
                    </button>
                </div>

            {:else if activeTab === 'support'}
                <div in:fade={{ duration: 200 }} class="space-y-6">
                    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-background border border-primary/30 p-5 shadow-lg">
                        <div class="absolute -right-4 -top-4 opacity-10 rotate-12">
                            <HeartHandshake class="w-24 h-24" />
                        </div>
                        <div class="relative z-10">
                            <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
                                <Sparkles class="w-4 h-4 text-primary" /> Support the Vision
                             </h3>
                            <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
                                P2P Companion is free and ad-free. Your donations keep the Edge servers running and directly fuel the development of the roadmap features!
                            </p>
                            
                            <div class="mt-4 space-y-2">
                                <a href="https://buymeacoffee.com/yourlink" target="_blank" class="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)] transition-all">
                                    <Coffee class="w-4 h-4" /> Buy me a Coffee
                                </a>
                                <button 
                                    onclick={handleDonate}
                                    class="w-full flex items-center justify-center gap-2 py-2.5 bg-background border border-white/10 text-foreground text-xs font-bold rounded-xl hover:bg-white/5 transition-all">
                                    <Wallet class="w-4 h-4" /> Donate Crypto
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 pt-2 border-t border-white/5">
                        <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reach Out</h4>
                        
                        <a href="mailto:your-email@example.com" class="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
                            <Mail class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <div class="text-xs text-foreground group-hover:text-primary transition-colors">Email Support</div>
                        </a>

                        <a href="https://github.com/your-github/p2p-companion/issues" target="_blank" class="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
                            <MessageSquare class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <div class="text-xs text-foreground group-hover:text-primary transition-colors">Report a Bug on GitHub</div>
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* Hide scrollbar for a much cleaner glassy look */
    .scrollbar-none::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-none {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>