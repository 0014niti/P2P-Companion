<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { Info, Map, X, CheckCircle2, PlayCircle, TrendingUp } from 'lucide-svelte';

	// Svelte 5 State Runes
	let mounted = $state(false);
	let showHowTo = $state(false);
	let showRoadmap = $state(false);

	// Delay the pop-in animation slightly so it grabs attention after the page loads
	onMount(() => {
		setTimeout(() => {
			mounted = true;
		}, 800);
	});
</script>

{#if mounted}
	<div 
		class="fixed right-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4"
		in:fly={{ x: 50, duration: 800, delay: 200 }}
	>
		<button
			onclick={() => showHowTo = true}
			class="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/70 backdrop-blur-xl border border-indigo-100 shadow-xl hover:bg-indigo-600 hover:scale-110 hover:shadow-indigo-500/30 transition-all duration-300"
		>
			<Info class="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
			
			<span class="pointer-events-none absolute right-16 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-zinc-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
				How to use Scanner
				<div class="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-zinc-900"></div>
			</span>
		</button>

		<button
			onmouseenter={() => showRoadmap = true}
			onmouseleave={() => showRoadmap = false}
			class="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/70 backdrop-blur-xl border border-blue-100 shadow-xl hover:bg-blue-600 hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300"
		>
			<Map class="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
			
			<span class="pointer-events-none absolute right-16 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-zinc-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
				View Roadmap
				<div class="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-zinc-900"></div>
			</span>
		</button>
	</div>
{/if}

{#if showRoadmap}
	<div 
		class="fixed right-20 top-1/2 -translate-y-1/2 z-[55] w-[300px] bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-blue-100 p-6 pointer-events-none"
		in:fly={{ x: 20, duration: 300 }} 
		out:fade={{ duration: 200 }}
	>
		<h3 class="font-black text-zinc-900 mb-4 flex items-center gap-2 text-lg">
			<Map class="h-5 w-5 text-blue-500"/> Terminal Roadmap
		</h3>
		<ul class="space-y-4 relative border-l-2 border-blue-100 ml-2 pl-5">
			<li class="relative">
				<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
				<h4 class="text-sm font-bold text-zinc-900">V1: P2P Engine</h4>
				<p class="text-xs text-zinc-500 mt-0.5">Live data & comparison (Current)</p>
			</li>
			<li class="relative">
				<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20 animate-pulse"></div>
				<h4 class="text-sm font-bold text-blue-900 flex items-center gap-2">V2: Premium Analytics <span class="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[8px] uppercase">Up Next</span></h4>
				<p class="text-xs text-zinc-600 mt-0.5">Historical charts & data signals.</p>
			</li>
			<li class="relative opacity-60">
				<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-300"></div>
				<h4 class="text-sm font-bold text-zinc-800">V3: API & Alerts</h4>
				<p class="text-xs text-zinc-500 mt-0.5">Real-time webhooks for developers.</p>
			</li>
		</ul>
	</div>
{/if}

{#if showHowTo}
	<div 
		class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4"
		in:fade={{ duration: 200 }} 
		out:fade={{ duration: 200 }}
	>
		<div 
			class="relative w-full max-w-lg rounded-[24px] bg-white p-8 shadow-2xl border border-indigo-50"
			in:scale={{ start: 0.95, duration: 300 }}
		>
			<button 
				onclick={() => showHowTo = false} 
				class="absolute right-5 top-5 h-8 w-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-600 transition-colors"
			>
				<X class="h-4 w-4" />
			</button>

			<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
				<PlayCircle class="h-6 w-6" />
			</div>
			
			<h2 class="text-2xl font-black tracking-tight text-zinc-900 mb-2">How to use the Terminal</h2>
			<p class="text-sm text-zinc-500 mb-6">Find the best P2P crypto rates in seconds.</p>

			<div class="space-y-5">
				<div class="flex gap-4">
					<div class="flex-shrink-0 mt-0.5"><CheckCircle2 class="h-5 w-5 text-indigo-500" /></div>
					<div>
						<h4 class="text-sm font-bold text-zinc-900">Set your Filters</h4>
						<p class="text-xs text-zinc-600 mt-1 leading-relaxed">Choose whether you want to Buy or Sell, select your crypto (USDT), and pick your local Fiat currency from the top menu.</p>
					</div>
				</div>
				
				<div class="flex gap-4">
					<div class="flex-shrink-0 mt-0.5"><TrendingUp class="h-5 w-5 text-indigo-500" /></div>
					<div>
						<h4 class="text-sm font-bold text-zinc-900">Compare the Spread</h4>
						<p class="text-xs text-zinc-600 mt-1 leading-relaxed">The table aggregates global data. Look at the <span class="text-emerald-500 font-bold">green</span> or <span class="text-red-500 font-bold">red</span> percentages to see how far the P2P rate deviates from the real market price.</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="flex-shrink-0 mt-0.5"><ArrowUpRight class="h-5 w-5 text-indigo-500" /></div>
					<div>
						<h4 class="text-sm font-bold text-zinc-900">Execute the Trade</h4>
						<p class="text-xs text-zinc-600 mt-1 leading-relaxed">Found the perfect rate? Click the blue action button to be taken directly to the merchant's ad on the secure exchange.</p>
					</div>
				</div>
			</div>

			<div class="mt-8">
				<button 
					onclick={() => showHowTo = false} 
					class="w-full rounded-xl bg-zinc-950 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
				>
					Got it, let's trade!
				</button>
			</div>
		</div>
	</div>
{/if}