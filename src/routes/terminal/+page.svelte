<script lang="ts">
	import FilterContainer from '$lib/components/filter/filter-container.svelte';
	import '@fontsource-variable/inter'; // <-- Self-hosted Inter font
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { filterExchangesArr } from '$lib/exchanges';
	import { cn } from '$lib/utils';
	import ExchangeCards from './exchange-cards.svelte';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import { p2pOrderStore } from '$lib/p2p-orders';
	import type { P2POrder } from '$lib/types';
	import Toast from '$lib/components/Toast.svelte';
	import { toastStore } from '$lib/toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	// 🌟 Added Download, BookOpen, and Zap icons for the new Dock
	import { Settings2, RefreshCw, Activity, Heart, Calculator, Sun, Moon, LayoutGrid, List, ShieldCheck, ChevronDown } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	
	import { slide, fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import SideGuide from '$lib/components/SideGuide.svelte';
	import OtcBoard from '$lib/components/OtcBoard.svelte';
	import DonationPopup from '$lib/components/DonationPopup.svelte';
	import BottomDock from '$lib/components/BottomDock.svelte';

	const filterStateSelectedToken = $derived(filterState.current.selectedToken);
	const currentFilters = $derived(filterState.current);

	let viewMode: 'cards' | 'table' = $state('cards');
	let showFilters = $state(false);
	let showDonation = $state(false);
	
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

	// --- 3. Live Premium Heatmap State ---
	const premiumHeatmap = $derived.by(() => {
		if (!$p2pOrderStore.marketRate || !$p2pOrderStore.orders) return [];
		const filterType = String(currentFilters.type || '').toUpperCase();
		const isBuy = filterType === 'BUY';

		return visibleExchanges.map(exchange => {
			const ads = ordersByExchange.get(exchange.name) || [];
			if (ads.length === 0) return { exchange: exchange.name, premium: null, colorClass: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400' };

			const bestPrice = isBuy 
				? Math.min(...ads.map(ad => Number(ad.price) || Infinity))
				: Math.max(...ads.map(ad => Number(ad.price) || -Infinity));

			if (bestPrice === Infinity || bestPrice === -Infinity) return { exchange: exchange.name, premium: null, colorClass: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400' };

			const premium = ((bestPrice - $p2pOrderStore.marketRate!) / $p2pOrderStore.marketRate!) * 100;
			
			let colorClass = 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500';
			if (premium <= 0) colorClass = 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]';
			else if (premium <= 1) colorClass = 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]';
			else if (premium <= 3) colorClass = 'bg-amber-500 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]';
			else colorClass = 'bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]';

			return { exchange: exchange.name, premium, colorClass };
		});
	});

	// --- 4. 7-Day Trend Sparkline State ---
	let sparklineData = $state<number[]>([]);
	const sparklinePath = $derived.by(() => {
		if (sparklineData.length < 2) return '';
		const min = Math.min(...sparklineData);
		const max = Math.max(...sparklineData);
		const range = max - min || 1;
		const width = 40;
		const height = 16;
		return sparklineData.map((val, i) => {
			const x = (i / (sparklineData.length - 1)) * width;
			const y = height - ((val - min) / range) * height;
			return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
		}).join(' ');
	});
	const sparklineTrend = $derived.by(() => {
		if (sparklineData.length < 2) return 'neutral';
		return sparklineData[sparklineData.length - 1] >= sparklineData[0] ? 'up' : 'down';
	});

	async function fetchSparkline(token: string, fiat: string) {
		sparklineData = [];
		try {
			const symbol = `${token}${fiat}`.toUpperCase();
			// Fetch 7 daily candles from the public Binance spot API
			const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=7`);
			if (!res.ok) return;
			const data = await res.json();
			if (Array.isArray(data)) {
				sparklineData = data.map(candle => parseFloat(candle[4])); // Index 4 is the Closing Price
			}
		} catch (e) {
			// Silently fail if the pair doesn't exist on Spot market
		}
	}

	// --- PWA Install State ---
	let deferredPrompt: any = null;
	let showInstallButton = $state(false);
	let initialFiatLoaded = $state(false); // New state to track if initial fiat is set

	$effect(() => {
		const type = currentFilters.type;
		const token = currentFilters.selectedToken;
		const fiat = currentFilters.fiat;

		// Only fetch orders once the initial fiat has been loaded (either from local storage or GeoIP)
		if (token && fiat && initialFiatLoaded) {
			p2pOrderStore.fetchOrders({ type, token, fiat });
			fetchSparkline(token, fiat);
		}
	});

	// Effect to save fiat to localStorage when it changes
	$effect(() => {
		if (currentFilters.fiat) {
			localStorage.setItem('selectedFiat', currentFilters.fiat);
		}
	});

	// Effect to save token to localStorage when it changes
	$effect(() => {
		if (currentFilters.selectedToken)
			localStorage.setItem('selectedToken', currentFilters.selectedToken);
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

		// Extract params from URL if navigated via a specific pair link
		const urlFiat = $page.url.searchParams.get('fiat')?.toUpperCase();
		const urlCrypto = $page.url.searchParams.get('crypto')?.toUpperCase();

		const savedExchanges = localStorage.getItem('activeExchanges');
		const savedFiat = localStorage.getItem('selectedFiat');
		const savedToken = localStorage.getItem('selectedToken');

		if (urlFiat) {
			filterState.current.fiat = urlFiat;
			initialFiatLoaded = true; // Pair loaded from the URL
		} else if (savedFiat) {
			filterState.current.fiat = savedFiat;
			initialFiatLoaded = true; // Fiat loaded from local storage
		}

		if (urlCrypto) {
			filterState.current.selectedToken = urlCrypto;
		} else if (savedToken) {
			filterState.current.selectedToken = savedToken;
		}

		// If no fiat saved in local storage, try to detect from IP
		if (!urlFiat && !savedFiat) {
			fetch('/api/geoip')
				.then((res) => res.json())
				.then((data) => (filterState.current.fiat = data.fiat))
				.finally(() => (initialFiatLoaded = true)); // Mark as loaded even if GeoIP fails
		}
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
	<!-- SEO Optimization -->
	<title>Live {currentFilters.type || 'BUY'} {currentFilters.selectedToken || 'USDT'} to {currentFilters.fiat || 'USD'} P2P Rates | P2P Terminal</title>
	<meta name="description" content="Compare real-time P2P crypto spreads for {currentFilters.selectedToken || 'USDT'} against {currentFilters.fiat || 'USD'}. Find the best rates across major global exchanges instantly." />
	<meta property="og:title" content="Live {currentFilters.selectedToken || 'USDT'} P2P Rates" />
	<meta property="og:description" content="Find the best {currentFilters.type || 'BUY'} rates across Binance, OKX, and Bybit instantly." />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://p2pcompanion.com/terminal" />
</svelte:head>

<style>
	:global(body) {
		font-family: 'Inter Variable', sans-serif;
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


<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute -top-[20%] -left-[10%] h-[70%] w-[60%] rounded-full bg-blue-400/10 dark:bg-blue-900/20 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-indigo-400/10 dark:bg-indigo-900/20 blur-[120px]"></div>
	<div class="absolute -bottom-[20%] left-[10%] h-[60%] w-[60%] rounded-full bg-sky-300/10 dark:bg-sky-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<main class="mx-auto max-w-screen-2xl px-4 pt-1 sm:pt-2 pb-6 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
	
	<div class="w-full relative flex items-center justify-center bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/40 dark:border-zinc-800/50 rounded-2xl p-2 md:p-3 shadow-lg shadow-black/5 min-h-[100px] overflow-hidden">
		<span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest absolute z-0">Advertisement</span>
		<ins class="adsbygoogle relative z-10"
			style="display:block; width:100%; min-height:100px; max-height:120px;"
			data-ad-client="ca-pub-5684719528000331"
			data-ad-slot="9054339491"
			data-ad-format="horizontal"
			data-full-width-responsive="true"></ins>
	</div>

	<div class="relative z-10 rounded-2xl border border-white/40 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-3xl p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none transition-all">
		<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
			
			<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
				<div class="flex items-center justify-between w-full sm:w-auto">
					<h1 class="sr-only">Live {currentFilters.type || 'BUY'} {currentFilters.selectedToken || 'USDT'} to {currentFilters.fiat || 'USD'} P2P Market Scanner</h1>
					{#if currentFilters.selectedToken}
						<div class="flex items-center gap-2">
							<span class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-black text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] tracking-wider uppercase border border-blue-400/50">
								{currentFilters.type} {currentFilters.selectedToken}
							</span>
						</div>
					{/if}
					
					<button
						class="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 text-rose-500 shadow-sm transition-all hover:scale-105 active:scale-95"
						onclick={() => (showDonation = true)}
						aria-label="Support the Dev"
					>
						<Heart class="size-4" />
					</button>
				</div>
				
				{#if $p2pOrderStore.marketRate || $p2pOrderStore.usdRate}
					<div class="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-zinc-500 overflow-x-auto hide-scrollbar pb-1 sm:pb-0 w-full sm:w-auto whitespace-nowrap">
						<Activity class="size-3.5 sm:size-4 text-blue-500 shrink-0" /> 
						<span class="shrink-0 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">Rates:</span>
						
						{#if $p2pOrderStore.usdRate && $p2pOrderStore.fiat !== 'USD'}
							<span class="shrink-0 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">1 USD = <strong class="text-zinc-800 dark:text-zinc-200">{$p2pOrderStore.usdRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {$p2pOrderStore.fiat}</strong></span>
						{/if}

						{#if $p2pOrderStore.marketRate && $p2pOrderStore.token !== 'USD'}
							<span class="shrink-0 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">1 {$p2pOrderStore.token} = <strong class="text-zinc-800 dark:text-zinc-200">{$p2pOrderStore.marketRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {$p2pOrderStore.fiat}</strong></span>
						{/if}

						<!-- NEW: 7-Day Sparkline -->
						{#if sparklineData.length > 1}
							<div class="flex items-center gap-2 ml-1 shrink-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm" title="7-Day Spot Market Trend">
								<span class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">7D</span>
								<svg width="40" height="16" viewBox="0 -2 40 20" class="overflow-visible">
									<path d={sparklinePath} fill="none" stroke={sparklineTrend === 'up' ? '#10b981' : '#e11d48'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={sparklineTrend === 'up' ? 'drop-shadow-[0_2px_4px_rgba(16,185,129,0.4)]' : 'drop-shadow-[0_2px_4px_rgba(225,29,72,0.4)]'} />
								</svg>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
				
				<button
					class="flex h-10 w-11 sm:h-11 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-gradient-to-b from-white/90 to-white/50 dark:from-zinc-800/90 dark:to-zinc-800/50 backdrop-blur-md shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] active:scale-95 active:translate-y-0 text-zinc-700 dark:text-zinc-400"
					onclick={toggleMode}
					aria-label="Toggle dark mode"
				>
					<Sun class="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</button>

				<button
					class="hidden md:flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-rose-200/60 dark:border-rose-900/60 bg-gradient-to-b from-white/90 to-white/50 dark:from-zinc-800/90 dark:to-zinc-800/50 backdrop-blur-md px-4 sm:px-5 text-sm font-black text-rose-600 dark:text-rose-500 shadow-[0_4px_12px_-4px_rgba(225,29,72,0.2)] transition-all hover:from-white hover:to-rose-50 dark:hover:from-zinc-800 dark:hover:to-rose-900/20 hover:border-rose-300 dark:hover:border-rose-800/60 hover:shadow-[0_4px_16px_-4px_rgba(225,29,72,0.4)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
					onclick={() => (showDonation = true)}
				>
					<Heart class="size-4" />
					<span>Support</span>
				</button>

				<button
					class={cn("flex-grow md:flex-none flex h-10 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-3 sm:px-6 text-[11px] sm:text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0", showFilters ? "bg-zinc-900 text-white border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)]" : "bg-gradient-to-b from-white/90 to-white/50 dark:from-zinc-800/90 dark:to-zinc-800/50 backdrop-blur-md border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]")}
					onclick={() => (showFilters = !showFilters)}
				>
					<Settings2 class="size-3.5 sm:size-4" />
					<span>Filters</span>
				</button>

				<div class="flex h-10 sm:h-11 flex-grow min-w-[120px] md:flex-none items-center rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-400/10 dark:bg-zinc-800/50 backdrop-blur-md p-1 shadow-inner">
					<button
						class={cn('flex-1 flex items-center justify-center gap-1.5 rounded-lg h-full text-[10px] sm:text-sm font-bold transition-all duration-300', viewMode === 'cards' ? 'bg-white dark:bg-zinc-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)] text-zinc-900 dark:text-white scale-100' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 scale-95 hover:bg-white/50 dark:hover:bg-zinc-700/50')}
						onclick={() => (viewMode = 'cards')}
					>
						<LayoutGrid class="size-3.5" /> Grid
					</button>
					<button
						class={cn('flex-1 flex items-center justify-center gap-1.5 rounded-lg h-full text-[10px] sm:text-sm font-bold transition-all duration-300', viewMode === 'table' ? 'bg-white dark:bg-zinc-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)] text-zinc-900 dark:text-white scale-100' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 scale-95 hover:bg-white/50 dark:hover:bg-zinc-700/50')}
						onclick={() => viewMode = 'table'}
					>
						<List class="size-3.5" /> Ledger
					</button>
				</div>

				<button
					class="flex h-10 w-11 sm:h-11 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-gradient-to-b from-white/90 to-white/50 dark:from-zinc-800/90 dark:to-zinc-800/50 backdrop-blur-md shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] active:scale-95 active:translate-y-0 disabled:opacity-50 text-zinc-700 dark:text-zinc-300"
					onclick={async () => { 
						if (currentFilters.selectedToken && currentFilters.fiat) {
							toastStore.add('Fetching live rates...', 'info', 2000);
							await p2pOrderStore.fetchOrders({ type: currentFilters.type, token: currentFilters.selectedToken, fiat: currentFilters.fiat });
							toastStore.add('Market data updated!', 'success');
						}
					}}
					disabled={$p2pOrderStore.isLoading}
					aria-label="Refresh Data"
				>
					<RefreshCw class={cn("size-4 sm:size-4.5", $p2pOrderStore.isLoading && "animate-spin text-blue-600")} />
				</button>
			</div>
		</div>
	</div>

	{#if showFilters}
		<div transition:slide={{ duration: 300, easing: cubicOut }} class="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-zinc-200/20 dark:shadow-none">
			<FilterContainer />
		</div>
	{/if}

	<div in:fly={{ y: -10, duration: 300 }} class="flex overflow-x-auto gap-2 py-2 hide-scrollbar w-full pt-2 sm:pt-4">
		{#each filterExchangesArr(filterStateSelectedToken) as exchange}
			<button 
				onclick={() => toggleExchange(exchange.name)}
				class="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-2
				{activeExchanges[exchange.name] !== false 
					? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm hover:border-blue-300 dark:hover:border-blue-700' 
					: 'bg-zinc-100/50 dark:bg-zinc-800/30 border-transparent text-zinc-400 dark:text-zinc-500 opacity-70 hover:opacity-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60'}"
			>
				<span class="w-2 h-2 rounded-full {activeExchanges[exchange.name] !== false ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-300'} transition-colors"></span>
				{exchange.name}
			</button>
		{/each}
	</div>

	<!-- NEW: Live Premium Heatmap -->
	{#if premiumHeatmap.length > 0}
		<div in:fly={{ y: -10, duration: 300, delay: 50 }} class="w-full mt-2 mb-4 sm:mb-6">
			<div class="flex items-center gap-2 mb-3 px-1">
				<span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Activity class="size-3" /> Premium Heatmap</span>
				<div class="h-px flex-1 bg-zinc-200/50 dark:bg-zinc-800/50"></div>
				<div class="flex items-center gap-3 text-[9px] font-bold text-zinc-400 hidden sm:flex">
					<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> &le; 0%</div>
					<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> 0-1%</div>
					<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> 1-3%</div>
					<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span> &gt; 3%</div>
				</div>
			</div>
			<div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
				{#each premiumHeatmap as item}
					<div class="flex-1 min-w-[80px] sm:min-w-[120px] flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all duration-500 {item.colorClass}">
						<span class="text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-0.5 opacity-90">{item.exchange}</span>
						{#if item.premium !== null}
							<span class="text-sm sm:text-lg font-black tracking-tighter">{item.premium > 0 ? '+' : ''}{item.premium.toFixed(2)}%</span>
						{:else}
							<span class="text-xs sm:text-sm font-bold opacity-50">N/A</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

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
						<div class="p-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 shadow-sm group-hover:border-blue-400 group-hover:shadow-blue-500/30 transition-all">
							<img src={exchange.icon} alt={exchange.name} class="w-9 h-9 rounded-full bg-white object-contain" />
						</div>
						<span class="text-[9px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{exchange.name}</span>
					</button>
				{/each}
			</div>

			<div class="relative w-full">
				<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }} 
					class="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 gap-4 sm:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:overflow-visible md:snap-none hide-scrollbar">
					
					{#if $p2pOrderStore.isLoading && (!$p2pOrderStore.orders || $p2pOrderStore.orders.length === 0)}
						{#each Array(5) as _}
							<div class="w-[88vw] max-w-[360px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink relative h-[400px] rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl overflow-hidden">
								<div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 dark:via-zinc-800/80 to-transparent z-10"></div>
								<div class="p-5 border-b border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-between bg-white/30 dark:bg-zinc-800/50">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 rounded-xl bg-zinc-200/80 dark:bg-zinc-700/80 animate-pulse"></div>
										<div class="h-5 w-24 bg-zinc-200/80 dark:bg-zinc-700/80 rounded-md animate-pulse"></div>
									</div>
									<div class="h-6 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full animate-pulse"></div>
								</div>
								<div class="p-4 space-y-6">
									{#each Array(4) as _}
										<div class="space-y-3">
											<div class="flex justify-between items-end">
												<div class="space-y-2 w-1/2">
													<div class="h-5 w-full bg-zinc-200/80 dark:bg-zinc-700/80 rounded animate-pulse"></div>
													<div class="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
												</div>
												<div class="h-4 w-1/4 bg-zinc-200/80 dark:bg-zinc-700/80 rounded animate-pulse"></div>
											</div>
											<div class="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
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
			<div in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }} out:fade={{ duration: 150 }} class="w-full overflow-x-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hide-scrollbar mt-2">
				<div class="min-w-[800px] p-1">
					<ComparisonTable orders={visibleOrders} isLoading={$p2pOrderStore.isLoading} />
				</div>
			</div>
		{/if}
	</div>

	<!-- SEO & AdSense Optimized Content Section -->
	<div class="mt-12 sm:mt-16 mb-24 max-w-6xl mx-auto w-full">
		<!-- Main Educational Article -->
		<div class="rounded-[32px] border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-10 shadow-xl shadow-zinc-200/20 dark:shadow-none mb-8">
			<header class="text-center max-w-3xl mx-auto mb-10">
				<span class="inline-block px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Market Analysis</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">How to Read the Live P2P Order Book</h2>
				<p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
					Welcome to the premier data terminal designed for everyday traders and analysts. Our infrastructure aggregates real-time Peer-to-Peer (P2P) order books across major centralized exchanges.
				</p>
			</header>

			<!-- Contextual Image (Pulled from Unsplash via optimized URL) -->
			<figure class="my-8 sm:my-12 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 relative group">
				<img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200&h=500" alt="Abstract visualization of a cryptocurrency trading terminal and global market liquidity" class="w-full object-cover h-48 sm:h-72 md:h-[400px] transition-transform duration-700 group-hover:scale-105" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
				<figcaption class="absolute bottom-4 sm:bottom-6 left-4 right-4 text-center text-sm sm:text-base text-white/90 font-medium drop-shadow-md">Visualizing real-time global crypto liquidity flows.</figcaption>
			</figure>

			<div class="grid md:grid-cols-2 gap-8 md:gap-12">
				<div>
					<h3 class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-4">Understanding P2P Price Differences</h3>
					<p class="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px] sm:text-base">
						Cryptocurrency valuations are not universally fixed. Depending on regional fiat demand, local payment gateways, and exchange-specific liquidity, the price of stablecoins like <strong>Tether (USDT)</strong> or <strong>Bitcoin (BTC)</strong> can vary significantly between platforms such as Binance, OKX, and Bybit. By tracking the variance between platforms where fiat demand is low versus where it is high, users can map precise market spreads and arbitrage opportunities.
					</p>
				</div>
				<div>
					<h3 class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-4">Why Compare Prices Globally?</h3>
					<p class="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px] sm:text-base">
						Manually auditing order books across multiple fragmented exchanges is highly inefficient and prone to data latency. This terminal automates the comparison process, providing a unified, live stream of the most competitive maker and taker rates. Whether you are looking for the highest fiat off-ramp rate or analyzing global liquidity, accessing unbiased data ensures absolute capital efficiency.
					</p>
				</div>
			</div>

			<hr class="my-10 sm:my-12 border-zinc-200 dark:border-zinc-800" />

			<h3 class="text-2xl font-black text-center mb-8 text-zinc-900 dark:text-white">Pro Trading Tips</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				<div class="p-6 sm:p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all group">
					<div class="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-2xl flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
						<Activity class="w-6 h-6" />
					</div>
					<h4 class="font-black text-blue-900 dark:text-blue-100 mb-3 text-lg">Identifying the "Best Rate"</h4>
					<p class="text-sm sm:text-[15px] text-blue-800/80 dark:text-blue-200/80 leading-relaxed">Our engine automatically highlights the absolute cheapest place to buy or the most profitable place to sell using a pulsing beacon, saving you manual calculation time. Keep an eye out for the glowing cards at the top of the grid.</p>
				</div>
				<div class="p-6 sm:p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 hover:shadow-md transition-all group">
					<div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/50 rounded-2xl flex items-center justify-center mb-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
						<ShieldCheck class="w-6 h-6" />
					</div>
					<h4 class="font-black text-emerald-900 dark:text-emerald-100 mb-3 text-lg">Merchant Verification</h4>
					<p class="text-sm sm:text-[15px] text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed">Always check a merchant's completion rate (indicated by the shield icon next to their name). A slightly worse price with a 99% completion rate is often significantly safer and faster than a good price from a brand new user.</p>
					<a href="/scam-check" class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
						Verify Merchant Rep <span class="text-lg leading-none">&rarr;</span>
					</a>
				</div>
			</div>
		</div>

		<!-- FAQ Accordion (Boosts AdSense Approval & SEO) -->
		<div class="rounded-[32px] border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-10 shadow-sm">
			<h3 class="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-8 text-center sm:text-left">Frequently Asked Questions</h3>
			<div class="space-y-4">
				<details class="group rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/50 p-5 open:bg-white dark:open:bg-zinc-800/80 transition-all duration-300 shadow-sm hover:border-blue-200 dark:hover:border-blue-800/50">
					<summary class="font-black text-zinc-900 dark:text-zinc-100 cursor-pointer list-none flex justify-between items-center text-base sm:text-lg">
						How often do the prices update?
						<span class="transition-transform duration-300 group-open:rotate-180 bg-zinc-200/50 dark:bg-zinc-700/50 p-1.5 rounded-full text-zinc-500">
							<ChevronDown class="w-5 h-5" />
						</span>
					</summary>
					<p class="text-zinc-600 dark:text-zinc-400 mt-4 text-[15px] leading-relaxed border-t border-zinc-100 dark:border-zinc-700/50 pt-4">
						Prices are fetched in real-time directly from the respective exchanges the moment you load the terminal or press the refresh button. Because P2P markets are highly volatile and merchant liquidity can dry up instantly, we highly recommend refreshing the data right before executing a cross-exchange trade to ensure the spread is still available.
					</p>
				</details>
				<details class="group rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/50 p-5 open:bg-white dark:open:bg-zinc-800/80 transition-all duration-300 shadow-sm hover:border-blue-200 dark:hover:border-blue-800/50">
					<summary class="font-black text-zinc-900 dark:text-zinc-100 cursor-pointer list-none flex justify-between items-center text-base sm:text-lg">
						Are the listed fees included in the price?
						<span class="transition-transform duration-300 group-open:rotate-180 bg-zinc-200/50 dark:bg-zinc-700/50 p-1.5 rounded-full text-zinc-500">
							<ChevronDown class="w-5 h-5" />
						</span>
					</summary>
					<p class="text-zinc-600 dark:text-zinc-400 mt-4 text-[15px] leading-relaxed border-t border-zinc-100 dark:border-zinc-700/50 pt-4">
						The prices shown in the terminal are the raw Ask and Bid prices listed directly by the merchants. However, calculating true net profit requires you to account for Maker/Taker fees imposed by the specific exchange (e.g., Binance vs Bybit), as well as any transaction fees incurred from your local payment method (such as domestic bank transfer fees). Use the built-in Arbitrage Calculator in the dock below to factor in these costs accurately.
					</p>
				</details>
				<details class="group rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/50 p-5 open:bg-white dark:open:bg-zinc-800/80 transition-all duration-300 shadow-sm hover:border-blue-200 dark:hover:border-blue-800/50">
					<summary class="font-black text-zinc-900 dark:text-zinc-100 cursor-pointer list-none flex justify-between items-center text-base sm:text-lg">
						Is P2P Companion affiliated with these exchanges?
						<span class="transition-transform duration-300 group-open:rotate-180 bg-zinc-200/50 dark:bg-zinc-700/50 p-1.5 rounded-full text-zinc-500">
							<ChevronDown class="w-5 h-5" />
						</span>
					</summary>
					<p class="text-zinc-600 dark:text-zinc-400 mt-4 text-[15px] leading-relaxed border-t border-zinc-100 dark:border-zinc-700/50 pt-4">
						No, P2P Companion is a completely independent, student-led data aggregator. We are not officially affiliated with, endorsed by, or sponsored by Binance, OKX, Bybit, or KuCoin. Our overarching goal is simply to provide unbiased, cross-platform liquidity data to democratize access to the global crypto economy without requiring users to log in or compromise their privacy.
					</p>
				</details>
			</div>
		</div>
	</div>

</main>

<Toast />

<DonationPopup bind:isOpen={showDonation} />

<SideGuide bind:isOpen={isGuideOpen} onDonateClick={() => (showDonation = true)} />
<OtcBoard bind:isOpen={isOtcBoardOpen} />

<BottomDock 
	{showInstallButton} 
	onInstall={installPWA} 
	onOpenGuide={() => (isGuideOpen = true)} 
	onOpenCalculator={() => {
		const buy = $p2pOrderStore.marketRate ? ($p2pOrderStore.marketRate * 0.99).toFixed(3) : 1.00;
		const sell = $p2pOrderStore.marketRate ? ($p2pOrderStore.marketRate * 1.01).toFixed(3) : 1.02;
		goto(`/calculator?fiat=${currentFilters.fiat || 'USD'}&crypto=${currentFilters.selectedToken || 'USDT'}&buy=${buy}&sell=${sell}`);
	}} 
	onOpenOtc={() => (isOtcBoardOpen = true)} 
/>