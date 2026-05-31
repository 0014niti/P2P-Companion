<script lang="ts">
	import { Search, Terminal, LineChart, Activity, BookOpen, ShieldAlert, TrendingUp, ArrowRight, Calculator } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import fiatList from '$lib/data/binance-fiat-list.json';
	import { page } from '$app/stores';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';

	let isOpen = $state(false);
	let searchQuery = $state('');
	let searchInput = $state<HTMLInputElement | null>(null);

	const baseCommands = [
		{ title: 'Open Terminal', subtitle: 'Live P2P Market Scanner', href: '/terminal', icon: Terminal, category: 'Navigation' },
		{ title: 'Pro Analytics', subtitle: 'Advanced arbitrage signals', href: '/pro', icon: LineChart, category: 'Navigation' },
		{ title: 'Live Markets', subtitle: 'Global order books', href: '/markets', icon: Activity, category: 'Navigation' },
		{ title: 'Market Insights Blog', subtitle: 'Strategies & news', href: '/blog', icon: BookOpen, category: 'Navigation' },
		{ title: 'Scam Check', subtitle: 'Verify merchant reputation', href: '/scam-check', icon: ShieldAlert, category: 'Tools' },
		{ title: 'Net Profit Calculator', subtitle: 'Calculate true margins with fees', href: '/calculator', icon: Calculator, category: 'Tools' }
	];

	const popularFiats = ['NGN', 'TRY', 'ARS', 'PHP', 'INR', 'BRL'];

	const marketCommands = fiatList.map(fiat => ({
		title: `USDT / ${fiat.currencyCode}`,
		subtitle: `Compare ${fiat.currencyCode} (${fiat.currencySymbol}) P2P Rates`,
		href: `/terminal?fiat=${fiat.currencyCode}&crypto=USDT`,
		icon: TrendingUp,
		category: popularFiats.includes(fiat.currencyCode) ? 'Popular Markets' : 'Global Markets'
	}));

	const commands = [...baseCommands, ...marketCommands];

	const filteredCommands = $derived(
		searchQuery.trim() === ''
			? commands
			: commands.filter(c =>
				c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.category.toLowerCase().includes(searchQuery.toLowerCase())
			  )
	);

	onMount(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				isOpen = !isOpen;
			}
			if (e.key === 'Escape' && isOpen) {
				isOpen = false;
			}
		};
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	$effect(() => {
		if (isOpen && searchInput) {
			// Focus the input instantly when opened
			setTimeout(() => searchInput?.focus(), 50);
		} else if (!isOpen) {
			searchQuery = '';
		}
	});

	function executeCommand(href: string) {
		isOpen = false;
		
		const url = new URL(href, window.location.origin);
		if ($page.url.pathname === '/terminal' && url.pathname === '/terminal') {
			const fiat = url.searchParams.get('fiat');
			const crypto = url.searchParams.get('crypto');
			if (fiat) filterState.current.fiat = fiat;
			if (crypto) filterState.current.selectedToken = crypto;
		}
		
		goto(href);
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4" transition:fade={{ duration: 200 }}>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onclick={() => isOpen = false} aria-hidden="true"></div>

		<!-- Modal -->
		<div
			class="relative w-full max-w-2xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-3xl border border-white/60 dark:border-zinc-700/60 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
			transition:scale={{ start: 0.95, duration: 300, easing: backOut }}
		>
			<!-- 3D top edge lighting -->
			<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-zinc-500 to-transparent opacity-50 z-10 pointer-events-none"></div>
			<!-- Subtle glow behind to give it depth -->
			<div class="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>

			<!-- Input area -->
			<div class="relative flex items-center px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 z-10 bg-white/40 dark:bg-zinc-900/40">
				<Search class="size-6 text-blue-600 dark:text-blue-400 mr-4 shrink-0" />
				<input
					bind:this={searchInput}
					bind:value={searchQuery}
					type="text"
					placeholder="Search markets, tools, or guides..."
					class="flex-1 bg-transparent text-xl font-black text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none w-full"
				/>
				<div class="hidden sm:flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-inner ml-2">
					<span class="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">ESC</span>
				</div>
			</div>

			<!-- Results -->
			<div class="max-h-[50vh] overflow-y-auto p-3 z-10">
				{#if filteredCommands.length === 0}
					<div class="flex flex-col items-center justify-center py-16 text-zinc-500">
						<Search class="size-12 opacity-20 mb-4" />
						<p class="text-sm font-bold">No results found for "{searchQuery}"</p>
						<p class="text-[11px] mt-1 opacity-70">Try searching for a fiat currency like "NGN" or "TRY"</p>
					</div>
				{:else}
					{@const categories = [...new Set(filteredCommands.map(c => c.category))]}
					{#each categories as category}
						<div class="mb-4 last:mb-0">
							<h3 class="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{category}</h3>
							<div class="space-y-1">
								{#each filteredCommands.filter(c => c.category === category) as cmd}
									<button
										onclick={() => executeCommand(cmd.href)}
										class="w-full group flex items-center justify-between p-3 rounded-2xl bg-transparent hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-700/60 transition-all duration-200 active:scale-[0.98]"
									>
										<div class="flex items-center gap-4">
											<div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-inner">
												<svelte:component this={cmd.icon} class="size-5" />
											</div>
											<div class="text-left">
												<h4 class="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cmd.title}</h4>
												<p class="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-0.5">{cmd.subtitle}</p>
											</div>
										</div>
										<ArrowRight class="size-4 text-zinc-300 dark:text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
									</button>
								{/each}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}