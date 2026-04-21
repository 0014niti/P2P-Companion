<script lang="ts">
	import FilterContainer from '$lib/components/filter/filter-container.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { filterExchangesArr } from '$lib/exchanges';
	import { cn } from '$lib/utils';
	import ExchangeCards from './exchange-cards.svelte';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import { p2pOrderStore } from '$lib/p2p-orders';
	import type { P2POrder } from '$lib/types';
	import { EllipsisVertical, RefreshCw } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

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
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 p-2 shadow-sm">
		<div class="flex flex-1 items-center gap-2 pl-1">
			<!-- 3-Dots Filter Toggle Button Moved to Left & Made More Visible -->
			<button
				class={cn("flex h-[34px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-primary bg-primary/10 px-3 font-semibold text-primary shadow-sm transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30", showFilters && "bg-primary/20 ring-1 ring-primary dark:bg-primary/30")}
				onclick={() => (showFilters = !showFilters)}
				title="Toggle Filters"
			>
				<EllipsisVertical class="size-4" />
				<span class="text-sm">Filters</span>
			</button>

			{#if currentFilters.selectedToken}
				<span class="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary uppercase whitespace-nowrap">{currentFilters.type} {currentFilters.selectedToken}</span>
			{/if}
		</div>

		<!-- Centered Spacer -->
		<div class="hidden sm:block flex-1"></div>

		<div class="flex flex-1 items-center justify-end gap-2">
			<!-- Manual Refresh Button -->
			<button
				class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
				onclick={() => {
					if (currentFilters.selectedToken && currentFilters.fiat) {
						p2pOrderStore.fetchOrders({ type: currentFilters.type, token: currentFilters.selectedToken, fiat: currentFilters.fiat });
					}
				}}
				title="Refresh Data"
				disabled={$p2pOrderStore.isLoading}
			>
				<RefreshCw class={cn("size-4 text-gray-500 dark:text-gray-400", $p2pOrderStore.isLoading && "animate-spin")} />
			</button>

			<!-- View Toggle -->
			<div
				class="flex shrink-0 items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-950"
			>
			<button
				class={cn(
					'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
					viewMode === 'cards'
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
						: 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
				)}
				onclick={() => (viewMode = 'cards')}
			>
				Cards
			</button>
			<button
				class={cn(
					'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
					viewMode === 'table'
						? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
						: 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
				)}
				onclick={() => viewMode = 'table'}
			>
				Table
			</button>
		</div>
		</div>
	</div>

	{#if showFilters}
		<div transition:slide={{ duration: 200 }} class="flex-1 rounded-xl border border-border bg-card p-3 shadow-sm md:p-4">
			<FilterContainer />
		</div>
	{/if}

	<div>
		{#if viewMode === 'cards'}
			<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:overflow-visible md:snap-none md:pb-0 hide-scrollbar">
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
			<ComparisonTable orders={$p2pOrderStore.orders} isLoading={$p2pOrderStore.isLoading} />
		{/if}
	</div>
</div>
