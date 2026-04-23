<script lang="ts">
	import FilterContainer from '$lib/components/filter/filter-container.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { filterExchangesArr } from '$lib/exchanges';
	import { cn } from '$lib/utils';
	import ExchangeCards from './exchange-cards.svelte';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import { p2pOrderStore } from '$lib/p2p-orders';
	import type { P2POrder } from '$lib/types';
	import { Settings2, RefreshCw, Activity } from 'lucide-svelte';
	import { slide, fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	const filterStateSelectedToken = $derived(filterState.current.selectedToken);
	const currentFilters = $derived(filterState.current);

	// State to toggle between Card view and Table view
	let viewMode: 'cards' | 'table' = $state('cards');
	let showFilters = $state(false);

	// Reactive effect to fetch data whenever filters change
	$effect(() => {
		const type = currentFilters.type;
		const token = currentFilters.selectedToken;
		const fiat = currentFilters.fiat;

		if (token && fiat) {
			p2pOrderStore.fetchOrders({ type, token, fiat });
		}
	});

	// Group orders by exchange name for the card view
	const ordersByExchange = $derived.by(() => {
		if (!$p2pOrderStore.orders) return new Map();
		return $p2pOrderStore.orders.reduce((acc, order) => {
			const key = order.exchange;
			if (!acc.has(key)) {
				acc.set(key, []);
			}
			acc.get(key)!.push(order);
			return acc;
		}, new Map<string, P2POrder[]>());
	});

	// Initialize Google AdSense banner after the component mounts
	onMount(() => {
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error('AdSense initialization error:', err);
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

	<!-- Google AdSense Global Script (Handles Auto Ads & Popups) -->
	<!-- Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Publisher ID -->
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
</svelte:head>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	/* Premium Micro-Scrollbar */
	:global(::-webkit-scrollbar) {
		width: 6px;
		height: 6px;
	}
	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(::-webkit-scrollbar-thumb) {
		background: #e4e4e7;
		border-radius: 10px;
	}
	:global(::-webkit-scrollbar-thumb:hover) {
		background: #a1a1aa;
	}
</style>

<!-- Premium Glassy Mesh Background -->
<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
	<!-- Soft Glowing Orbs -->
	<div class="absolute -top-[20%] -left-[10%] h-[70%] w-[60%] rounded-full bg-blue-400/10 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-indigo-400/10 blur-[120px]"></div>
	<div class="absolute -bottom-[20%] left-[10%] h-[60%] w-[60%] rounded-full bg-sky-300/10 blur-[120px]"></div>
	
	<!-- Subtle Structural Grid Overlay -->
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
	
	<!-- Responsive Header Banner Ad -->
	<div class="w-full relative flex items-center justify-center bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-2xl p-2 md:p-3 shadow-sm min-h-[100px] overflow-hidden">
		<span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest absolute z-0">Advertisement</span>
		
		<!-- Replace data-ad-client and data-ad-slot with your actual Ad IDs -->
		<ins class="adsbygoogle relative z-10"
			style="display:block; width:100%; max-height:120px;"
			data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
			data-ad-slot="YYYYYYYYYYYY"
			data-ad-format="horizontal"
			data-full-width-responsive="true"></ins>
	</div>

	<!-- Dashboard Console Header -->
	<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<h2 class="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">Market Overview</h2>
				{#if currentFilters.selectedToken}
					<span class="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 text-[11px] font-bold shadow-sm tracking-wide uppercase mt-1">{currentFilters.type} {currentFilters.selectedToken}</span>
				{/if}
			</div>
			
			<!-- Premium Market Rates Pills -->
			{#if $p2pOrderStore.marketRate || $p2pOrderStore.usdRate}
				<div class="flex flex-wrap items-center gap-3">
					<div class="flex items-center gap-1.5 text-sm font-bold text-zinc-500 mr-1">
						<Activity class="size-4 text-blue-500" /> Official Rates
					</div>
					
					{#if $p2pOrderStore.usdRate && $p2pOrderStore.fiat !== 'USD'}
						<div class="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-white/80 backdrop-blur-md px-3 py-1.5 shadow-sm">
							<span class="text-zinc-500 font-semibold text-xs">1 USD =</span>
							<span class="font-black text-zinc-900 text-sm">{$p2pOrderStore.usdRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {$p2pOrderStore.fiat}</span>
						</div>
					{/if}

					{#if $p2pOrderStore.marketRate && $p2pOrderStore.token !== 'USD'}
						<div class="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-white/80 backdrop-blur-md px-3 py-1.5 shadow-sm">
							<span class="text-zinc-500 font-semibold text-xs">1 {$p2pOrderStore.token} =</span>
							<span class="font-black text-zinc-900 text-sm">{$p2pOrderStore.marketRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {$p2pOrderStore.fiat}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Action Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button
				class={cn("flex h-10 items-center justify-center gap-2 rounded-xl border px-5 font-bold shadow-sm transition-all duration-300 ease-out active:scale-95", showFilters ? "bg-zinc-900 text-white border-zinc-900 shadow-zinc-900/10" : "bg-white/80 backdrop-blur-md border-zinc-200/60 text-zinc-700 hover:bg-white")}
				onclick={() => (showFilters = !showFilters)}
			>
				<Settings2 class="size-4" />
				<span>Filters</span>
			</button>

			<button
				class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 ease-out hover:bg-white active:scale-95 disabled:opacity-50 text-zinc-700"
				onclick={() => { if (currentFilters.selectedToken && currentFilters.fiat) p2pOrderStore.fetchOrders({ type: currentFilters.type, token: currentFilters.selectedToken, fiat: currentFilters.fiat }); }}
				disabled={$p2pOrderStore.isLoading}
			>
				<RefreshCw class={cn("size-4", $p2pOrderStore.isLoading && "animate-spin text-blue-600")} />
			</button>

			<div class="flex h-10 items-center rounded-xl border border-zinc-200/60 bg-white/80 backdrop-blur-md p-1 shadow-sm">
				<button
					class={cn('rounded-lg px-4 h-full text-sm font-bold transition-all duration-300 ease-out active:scale-95', viewMode === 'cards' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-800')}
					onclick={() => (viewMode = 'cards')}
				>Cards</button>
				<button
					class={cn('rounded-lg px-4 h-full text-sm font-bold transition-all duration-300 ease-out active:scale-95', viewMode === 'table' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-800')}
					onclick={() => viewMode = 'table'}
				>Table</button>
			</div>
		</div>
	</div>

	<!-- Filters Expansion -->
	{#if showFilters}
		<div transition:slide={{ duration: 300, easing: cubicOut }} class="rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-lg shadow-zinc-200/20">
			<FilterContainer />
		</div>
	{/if}

	<div class="pt-2">
		{#if viewMode === 'cards'}
			<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }} class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:overflow-visible md:snap-none md:pb-0 hide-scrollbar">
				{#each filterExchangesArr(filterStateSelectedToken) as exchange (exchange.key)}
					<div class="w-[85vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink">
						<ExchangeCards
							{exchange}
							ads={ordersByExchange.get(exchange.name) ?? []}
							isLoading={$p2pOrderStore.isLoading}
							error={$p2pOrderStore.errors[exchange.key]}
						/>
					</div>
				{/each}
			</div>
		{:else}
			<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }}>
				<ComparisonTable orders={$p2pOrderStore.orders} isLoading={$p2pOrderStore.isLoading} />
			</div>
		{/if}
	</div>
{:else}
			<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }}>
				<ComparisonTable orders={$p2pOrderStore.orders} isLoading={$p2pOrderStore.isLoading} />
			</div>
		{/if}
	</div>

	<article class="mt-12 rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-sm">
		<h2 class="text-2xl font-black tracking-tight text-zinc-900 mb-4">Global Crypto P2P Arbitrage Scanner</h2>
		<p class="text-zinc-700 mb-6 leading-relaxed">
			Welcome to the premier global arbitrage terminal designed for cryptocurrency traders. Our tool aggregates real-time Peer-to-Peer (P2P) data across major centralized exchanges, allowing you to instantly compare USDT prices and identify lucrative arbitrage opportunities across different fiat currencies.
		</p>

		<h3 class="text-xl font-bold text-zinc-800 mb-3">How P2P Arbitrage Works</h3>
		<p class="text-zinc-700 mb-6 leading-relaxed">
			Cryptocurrency prices are not universally fixed. Depending on regional demand, local payment methods, and exchange liquidity, the price of stablecoins like USDT can vary significantly between platforms such as Binance, OKX, Bybit, and KuCoin. By buying digital assets on an exchange where the fiat price is low and selling them on an exchange where the demand drives the price higher, traders can capture the price spread.
		</p>

		<h3 class="text-xl font-bold text-zinc-800 mb-3">Why Compare USDT Prices Globally?</h3>
		<p class="text-zinc-700 leading-relaxed">
			Manually monitoring order books across multiple exchanges is time-consuming and often results in missed opportunities due to market volatility. This scanner automates the discovery process, providing a unified, live view of the best available maker and taker prices. Whether you are executing high-volume arbitrage trades or looking for the most efficient fiat off-ramp, comparing global rates ensures maximum capital efficiency.
		</p>
	</article>

</div> ```

### Why this specific text works for the algorithm:
1.  **`<article>` tag:** Wraps the text in an HTML5 semantic element that tells Google "this is the core written content of the page."
2.  **Keyword Proximity:** It naturally includes high-value terms like "P2P Arbitrage," "Compare USDT prices," "Binance," "OKX," "fiat off-ramp," and "stablecoins."
3.  **TF-IDF Score:** It provides enough context (about 200 words) for the algorithm to confidently classify your dynamic application as a financial comparison tool, rather than a blank page with a javascript table.
</div>
