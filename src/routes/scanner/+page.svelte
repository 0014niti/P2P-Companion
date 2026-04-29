<script lang="ts">
	import FilterContainer from '$lib/components/filter/filter-container.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { filterExchangesArr } from '$lib/exchanges';
	import { cn } from '$lib/utils';
	import ExchangeCards from './exchange-cards.svelte';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import { p2pOrderStore } from '$lib/p2p-orders';
	import type { P2POrder } from '$lib/types';
	
	// 🌟 Added Download, BookOpen, and Zap icons for the new Dock
	import { Settings2, RefreshCw, Activity, Heart, Copy, Check, X, Download, BookOpen, Zap } from 'lucide-svelte';
	
	import { slide, fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import SideGuide from '$lib/components/SideGuide.svelte';
	import OtcBoard from '$lib/components/OtcBoard.svelte';

	const filterStateSelectedToken = $derived(filterState.current.selectedToken);
	const currentFilters = $derived(filterState.current);

	let viewMode: 'cards' | 'table' = $state('cards');
	let showFilters = $state(false);
	let showDonation = $state(false);
	let copiedCoin = $state('');
	
	let isOtcBoardOpen = $state(false);
	// 🌟 NEW: Guide State for the dock
	let isGuideOpen = $state(false); 

	// --- 1. Customization: Exchange Toggles State ---
	let activeExchanges = $state<Record<string, boolean>>({});

	const visibleExchanges = $derived(
		filterExchangesArr(filterStateSelectedToken).filter(ex => activeExchanges[ex.name] !== false)
	);

	const visibleOrders = $derived(
		$p2pOrderStore.orders?.filter(order => activeExchanges[order.exchange] !== false) || []
	);

	function toggleExchange(name: string) {
		if (activeExchanges[name] === undefined) {
			activeExchanges[name] = false;
		} else {
			activeExchanges[name] = !activeExchanges[name];
		}
	}

	// --- 2. Arbitrage Engine: Best Buy/Sell Spotter ---
	const bestRateExchangeName = $derived.by(() => {
		if (!$p2pOrderStore.orders || $p2pOrderStore.orders.length === 0) return null;
		
		let bestExchange = null;
		const filterType = String(currentFilters.type || '').toUpperCase();
		const isBuy = filterType === 'BUY';
		
		let bestPrice = isBuy ? Infinity : -Infinity;

		for (const exchange of visibleExchanges) {
			const ads = ordersByExchange.get(exchange.name) || [];
			
			if (ads.length > 0 && ads[0] && ads[0].price !== undefined) {
				const price = Number(ads[0].price);
				
				if (!isNaN(price)) {
					if (isBuy && price < bestPrice) {
						bestPrice = price;
						bestExchange = exchange.name;
					} else if (!isBuy && price > bestPrice) {
						bestPrice = price;
						bestExchange = exchange.name;
					}
				}
			}
		}
		return bestExchange;
	});

	// --- PWA Install State ---
	let deferredPrompt: any = null;
	let showInstallButton = $state(false);

	function copyAddress(address: string, coin: string) {
		navigator.clipboard.writeText(address);
		copiedCoin = coin;
		setTimeout(() => { copiedCoin = ''; }, 2000);
	}

	$effect(() => {
		const type = currentFilters.type;
		const token = currentFilters.selectedToken;
		const fiat = currentFilters.fiat;

		if (token && fiat) {
			p2pOrderStore.fetchOrders({ type, token, fiat });
		}
	});

	$effect(() => {
		if (Object.keys(activeExchanges).length > 0) {
			localStorage.setItem('activeExchanges', JSON.stringify(activeExchanges));
		}
	});

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

	onMount(() => {
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error('AdSense error:', err);
		}

		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstallButton = true;
		});

		const savedExchanges = localStorage.getItem('activeExchanges');
		if (savedExchanges) {
			activeExchanges = JSON.parse(savedExchanges);
		}
	});

	async function installPWA() {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === 'accepted') {
				showInstallButton = false;
			}
			deferredPrompt = null;
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
</svelte:head>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
		-webkit-font-smoothing: antialiased;
		overflow-x: hidden;
	}
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
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
	.animate-shimmer {
		animation: shimmer 2s infinite;
	}
</style>


<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
	<div class="absolute -top-[20%] -left-[10%] h-[70%] w-[60%] rounded-full bg-blue-400/10 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-indigo-400/10 blur-[120px]"></div>
	<div class="absolute -bottom-[20%] left-[10%] h-[60%] w-[60%] rounded-full bg-sky-300/10 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<div class="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
	
	<div class="w-full relative flex items-center justify-center bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-2xl p-2 md:p-3 shadow-sm min-h-[100px] overflow-hidden">
		<span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest absolute z-0">Advertisement</span>
		<ins class="adsbygoogle relative z-10"
			style="display:block; width:100%; max-height:120px;"
			data-ad-client="ca-pub-5684719528000331"
			data-ad-slot="9054339491"
			data-ad-format="horizontal"
			data-full-width-responsive="true"></ins>
	</div>

	<div class="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
		
		<div class="space-y-1.5 sm:space-y-3 w-full lg:w-auto">
			<div class="flex items-center justify-between w-full lg:justify-start lg:gap-4">
				<div class="flex items-center gap-2 sm:gap-3">
					<h2 class="text-2xl font-black tracking-tight text-zinc-900 sm:text-4xl">Market</h2>
					{#if currentFilters.selectedToken}
						<span class="rounded-lg bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-[11px] font-bold shadow-sm tracking-wide uppercase mt-0.5">{currentFilters.type} {currentFilters.selectedToken}</span>
					{/if}
				</div>
				
				<button
					class="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-rose-500 shadow-sm transition-transform active:scale-95"
					onclick={() => (showDonation = true)}
				>
					<Heart class="size-4" />
				</button>
			</div>
			
			{#if $p2pOrderStore.marketRate || $p2pOrderStore.usdRate}
				<div class="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-zinc-500 overflow-x-auto hide-scrollbar pb-1 w-full whitespace-nowrap">
					<Activity class="size-3.5 text-blue-500 shrink-0" /> 
					<span class="shrink-0 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">Rates:</span>
					
					{#if $p2pOrderStore.usdRate && $p2pOrderStore.fiat !== 'USD'}
						<span class="shrink-0 bg-white/60 px-1.5 py-0.5 rounded border border-zinc-200/50">1 USD = <strong class="text-zinc-800">{$p2pOrderStore.usdRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {$p2pOrderStore.fiat}</strong></span>
					{/if}

					{#if $p2pOrderStore.marketRate && $p2pOrderStore.token !== 'USD'}
						<span class="shrink-0 bg-white/60 px-1.5 py-0.5 rounded border border-zinc-200/50">1 {$p2pOrderStore.token} = <strong class="text-zinc-800">{$p2pOrderStore.marketRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {$p2pOrderStore.fiat}</strong></span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-2 w-full lg:w-auto">
			
			<button
				class="hidden md:flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200/60 bg-white/80 backdrop-blur-md px-4 text-sm font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-50 hover:border-rose-300 active:scale-95"
				onclick={() => (showDonation = true)}
			>
				<Heart class="size-4" />
				<span>Support</span>
			</button>

			<button
				class={cn("flex-[1.2] md:flex-none flex h-9 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-5 text-[11px] sm:text-sm font-bold shadow-sm transition-all active:scale-95", showFilters ? "bg-zinc-900 text-white border-zinc-900 shadow-zinc-900/10" : "bg-white/80 backdrop-blur-md border-zinc-200/60 text-zinc-700 hover:bg-white")}
				onclick={() => (showFilters = !showFilters)}
			>
				<Settings2 class="size-3.5 sm:size-4" />
				<span>Filters</span>
			</button>

			<div class="flex h-9 sm:h-11 flex-[1.5] md:flex-none items-center rounded-xl border border-zinc-200/60 bg-white/80 backdrop-blur-md p-1 shadow-sm">
				<button
					class={cn('flex-1 rounded-lg h-full text-[10px] sm:text-sm font-bold transition-all active:scale-95', viewMode === 'cards' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-800')}
					onclick={() => (viewMode = 'cards')}
				>Cards</button>
				<button
					class={cn('flex-1 rounded-lg h-full text-[10px] sm:text-sm font-bold transition-all active:scale-95', viewMode === 'table' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-800')}
					onclick={() => viewMode = 'table'}
				>Table</button>
			</div>
			
			<button
				class="flex h-9 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-sm transition-all hover:bg-white active:scale-95 disabled:opacity-50 text-zinc-700"
				onclick={() => { if (currentFilters.selectedToken && currentFilters.fiat) p2pOrderStore.fetchOrders({ type: currentFilters.type, token: currentFilters.selectedToken, fiat: currentFilters.fiat }); }}
				disabled={$p2pOrderStore.isLoading}
			>
				<RefreshCw class={cn("size-3.5 sm:size-4", $p2pOrderStore.isLoading && "animate-spin text-blue-600")} />
			</button>
		</div>
	</div>

	{#if showFilters}
		<div transition:slide={{ duration: 300, easing: cubicOut }} class="rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-zinc-200/20">
			<FilterContainer />
		</div>
	{/if}

	<div in:fly={{ y: -10, duration: 300 }} class="flex overflow-x-auto gap-2 py-2 hide-scrollbar w-full pt-2 sm:pt-4">
		{#each filterExchangesArr(filterStateSelectedToken) as exchange}
			<button 
				onclick={() => toggleExchange(exchange.name)}
				class="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-2
				{activeExchanges[exchange.name] !== false 
					? 'bg-white border-zinc-200 text-zinc-800 shadow-sm hover:border-blue-300' 
					: 'bg-zinc-100/50 border-transparent text-zinc-400 opacity-70 hover:opacity-100 hover:bg-zinc-200/50'}"
			>
				<span class="w-2 h-2 rounded-full {activeExchanges[exchange.name] !== false ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-300'} transition-colors"></span>
				{exchange.name}
			</button>
		{/each}
	</div>

	<div class="relative w-full">
		{#if viewMode === 'cards'}
			
			<div in:fly={{ y: 10, duration: 300, delay: 100 }} class="md:hidden flex overflow-x-auto gap-4 py-3 hide-scrollbar w-full mb-2">
				{#each visibleExchanges as exchange}
					<button 
						onclick={() => {
							const el = document.getElementById(`card-${exchange.name}`);
							if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
						}}
						class="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform"
					>
						<div class="p-0.5 rounded-full border border-zinc-200/80 bg-white shadow-sm group-hover:border-blue-400 group-hover:shadow-blue-500/30 transition-all">
							<img src={exchange.icon} alt={exchange.name} class="w-9 h-9 rounded-full bg-white object-contain" />
						</div>
						<span class="text-[9px] font-black text-zinc-600 uppercase tracking-wider">{exchange.name}</span>
					</button>
				{/each}
			</div>

			<div class="relative w-full">
				<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }} 
					class="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 gap-4 sm:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:overflow-visible md:snap-none hide-scrollbar">
					
					{#if $p2pOrderStore.isLoading && (!$p2pOrderStore.orders || $p2pOrderStore.orders.length === 0)}
						{#each Array(5) as _}
							<div class="w-[88vw] max-w-[360px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink relative h-[400px] rounded-2xl bg-white/50 backdrop-blur-2xl border border-zinc-200/60 shadow-xl overflow-hidden">
								<div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>
								<div class="p-5 border-b border-zinc-200/50 flex items-center justify-between bg-white/30">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 rounded-xl bg-zinc-200/80 animate-pulse"></div>
										<div class="h-5 w-24 bg-zinc-200/80 rounded-md animate-pulse"></div>
									</div>
									<div class="h-6 w-16 bg-blue-100 rounded-full animate-pulse"></div>
								</div>
								<div class="p-4 space-y-6">
									{#each Array(4) as _}
										<div class="space-y-3">
											<div class="flex justify-between items-end">
												<div class="space-y-2 w-1/2">
													<div class="h-5 w-full bg-zinc-200/80 rounded animate-pulse"></div>
													<div class="h-3 w-2/3 bg-zinc-100 rounded animate-pulse"></div>
												</div>
												<div class="h-4 w-1/4 bg-zinc-200/80 rounded animate-pulse"></div>
											</div>
											<div class="h-3 w-3/4 bg-zinc-100 rounded animate-pulse"></div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					
					{:else}
						{#each visibleExchanges as exchange (exchange.key)}
							<div id="card-{exchange.name}" 
								 class="w-[88vw] max-w-[360px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink relative transition-all duration-300 hover:-translate-y-1">
								<ExchangeCards
									{exchange}
									ads={ordersByExchange.get(exchange.name) ?? []}
									isLoading={$p2pOrderStore.isLoading}
									error={$p2pOrderStore.errors[exchange.key]}
									isBestRate={bestRateExchangeName === exchange.name}
									filterType={String(currentFilters.type || 'BUY').toUpperCase()}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{:else}
			<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }} class="w-full overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white/50 backdrop-blur-sm shadow-sm hide-scrollbar mt-2">
				<div class="min-w-[800px] p-1">
					<ComparisonTable orders={visibleOrders} isLoading={$p2pOrderStore.isLoading} />
				</div>
			</div>
		{/if}
	</div>

	<article class="mt-8 sm:mt-12 rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-xl p-5 sm:p-8 shadow-sm mb-20">
		<h2 class="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 mb-3 sm:mb-4">Global P2P Market Intelligence & Price Comparison</h2>
		<p class="text-sm sm:text-base text-zinc-700 mb-5 sm:mb-6 leading-relaxed">
			Welcome to the premier data terminal designed for everyday traders and analysts. Our infrastructure aggregates real-time Peer-to-Peer (P2P) order books across major centralized exchanges, allowing you to instantly compare USDT pricing dynamics and identify the best available rates across different fiat currencies.
		</p>
		<h3 class="text-lg sm:text-xl font-bold text-zinc-800 mb-2 sm:mb-3">Understanding P2P Price Differences</h3>
		<p class="text-sm sm:text-base text-zinc-700 mb-5 sm:mb-6 leading-relaxed">
			Cryptocurrency valuations are not universally fixed. Depending on regional demand, local payment gateways, and exchange-specific liquidity, the price of stablecoins like USDT can vary significantly between platforms such as Binance, OKX, and Bybit. By tracking the variance between platforms where fiat demand is low versus where it is high, users can map precise market spreads.
		</p>
		<h3 class="text-lg sm:text-xl font-bold text-zinc-800 mb-2 sm:mb-3">Why Compare USDT Prices Globally?</h3>
		<p class="text-sm sm:text-base text-zinc-700 leading-relaxed">
			Manually auditing order books across multiple fragmented exchanges is inefficient and prone to data latency. This terminal automates the comparison process, providing a unified, live stream of the most competitive maker and taker rates. Whether looking for the highest fiat off-ramp rate or analyzing global liquidity, unbiased data ensures optimal capital efficiency.
		</p>
	</article>

</div>

{#if showDonation}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4" onclick={(e) => { if (e.target === e.currentTarget) showDonation = false; }} transition:fade={{ duration: 200 }}>
        <div class="w-full max-w-md rounded-[24px] border border-white/60 bg-white/90 backdrop-blur-2xl p-6 shadow-2xl" transition:fly={{ y: 20, duration: 300, easing: cubicOut }}>
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 text-rose-600">
                    <Heart class="size-5 fill-current" />
                    <h3 class="text-xl font-black text-zinc-900">Support the Dev</h3>
                </div>
                <button class="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 transition-colors" onclick={() => (showDonation = false)}>
                    <X class="size-5" />
                </button>
            </div>
            <p class="text-sm text-zinc-600 mb-6 font-medium leading-relaxed">
                If this terminal helped you capture a profitable spread, consider supporting the server costs to keep it 100% free and ad-light.
            </p>
            <div class="space-y-3">
                <div class="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 transition-colors hover:border-blue-300">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">USDT (TRC20 Network)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white px-2.5 py-2 text-xs text-zinc-600 border border-zinc-200 shadow-inner">TR6EdNsQhXnZ8dRb3dZqveJRPxZftvSyr9</code>
                        <button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all active:scale-95 shadow-sm" onclick={() => copyAddress('TR6EdNsQhXnZ8dRb3dZqveJRPxZftvSyr9', 'USDT')}>
                            {#if copiedCoin === 'USDT'} <Check class="size-4 text-green-500" /> {:else} <Copy class="size-4" /> {/if}
                        </button>
                    </div>
                </div>
                <div class="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 transition-colors hover:border-orange-300">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">Bitcoin (BTC)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white px-2.5 py-2 text-xs text-zinc-600 border border-zinc-200 shadow-inner">YOUR_BTC_ADDRESS</code>
                        <button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all active:scale-95 shadow-sm" onclick={() => copyAddress('YOUR_BTC_ADDRESS', 'BTC')}>
                            {#if copiedCoin === 'BTC'} <Check class="size-4 text-green-500" /> {:else} <Copy class="size-4" /> {/if}
                        </button>
                    </div>
                </div>
                <div class="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-400">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">Ripple (XRP)</span>
                        <span class="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">Include Memo if required</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white px-2.5 py-2 text-xs text-zinc-600 border border-zinc-200 shadow-inner">YOUR_XRP_ADDRESS</code>
                        <button class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all active:scale-95 shadow-sm" onclick={() => copyAddress('YOUR_XRP_ADDRESS', 'XRP')}>
                            {#if copiedCoin === 'XRP'} <Check class="size-4 text-green-500" /> {:else} <Copy class="size-4" /> {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<SideGuide bind:isOpen={isGuideOpen} onDonateClick={() => (showDonation = true)} />
<OtcBoard bind:isOpen={isOtcBoardOpen} />

<div class="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center p-1.5 rounded-full bg-zinc-900/85 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]">

	{#if showInstallButton}
		<button 
			class="group flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] md:text-xs font-bold active:scale-95"
			onclick={installPWA}
			title="Install Web App"
		>
			<Download class="size-4 md:size-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
			<span class="hidden md:inline whitespace-nowrap">Install App</span>
		</button>

		<div class="w-px h-5 bg-white/10 mx-1"></div>
	{/if}

	<button 
		class="group flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] md:text-xs font-bold active:scale-95"
		onclick={() => isGuideOpen = true}
		title="Platform Guide"
	>
		<BookOpen class="size-4 md:size-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
		<span class="hidden md:inline whitespace-nowrap">User Guide</span>
	</button>

	<div class="w-px h-5 bg-white/10 ml-1 mr-2 md:mx-2"></div>

	<button 
		onclick={() => isOtcBoardOpen = true}
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