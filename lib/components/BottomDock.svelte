<script lang="ts">
    import { Download, BookOpen, Zap, Lock, Calculator } from 'lucide-svelte';

    let {
        showInstallButton = false,
        onInstall = () => {},
        onOpenGuide = () => {},
        onOpenCalculator = () => {},
        onOpenOtc = () => {}
    } = $props<{
        showInstallButton?: boolean;
        onInstall?: () => void;
        onOpenGuide?: () => void;
        onOpenCalculator?: () => void;
        onOpenOtc?: () => void;
    }>();
</script>

<div class="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center p-1.5 rounded-full bg-zinc-900/85 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]">

	{#if showInstallButton}
		<button 
			class="group flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] md:text-xs font-bold active:scale-95"
			onclick={onInstall}
			title="Install Web App"
		>
			<Download class="size-4 md:size-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
			<span class="hidden md:inline whitespace-nowrap">Install App</span>
		</button>

		<div class="w-px h-5 bg-white/10 mx-1"></div>
	{/if}

	<button 
		class="group flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] md:text-xs font-bold active:scale-95"
		onclick={onOpenGuide}
		title="Platform Guide"
	>
		<BookOpen class="size-4 md:size-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
		<span class="hidden md:inline whitespace-nowrap">User Guide</span>
	</button>

	<button 
		class="group flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] md:text-xs font-bold active:scale-95"
		onclick={onOpenCalculator}
		title="Arbitrage Calculator"
	>
		<Calculator class="size-4 md:size-4 group-hover:-translate-y-0.5 group-hover:text-blue-400 transition-all duration-300" />
		<span class="hidden md:inline whitespace-nowrap">Calculator</span>
	</button>

	<a
		href="/pro"
		class="group flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] md:text-xs font-bold active:scale-95"
		title="Premium Analytics"
		data-sveltekit-preload-data="off"
	>
		<Lock class="size-4 md:size-4 group-hover:text-blue-400 transition-colors duration-300" />
		<span class="hidden md:inline whitespace-nowrap">Pro</span>
	</a>

	<div class="w-px h-5 bg-white/10 ml-1 mr-2 md:mx-2"></div>

	<button 
		onclick={onOpenOtc}
		class="group flex items-center gap-2 md:gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 md:px-5 py-2.5 text-[11px] md:text-sm font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-95 border border-blue-400/50 relative overflow-hidden"
	>
		<span class="relative flex h-2 w-2 md:h-2.5 md:w-2.5 shrink-0">
		  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
		  <span class="relative inline-flex rounded-full h-full w-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
		</span>

		<span class="relative z-10 tracking-wide drop-shadow-sm whitespace-nowrap">OTC Nexus</span>

		<Zap class="size-3.5 md:size-4 fill-white text-white drop-shadow-md group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
	</button>
</div>