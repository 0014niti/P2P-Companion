<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { filterExchangesArr } from '$lib/exchanges';
	import { filterState } from '$lib/components/filter/stateFilter.svelte.ts';
	import { p2pOrderStore } from '$lib/p2p-orders';

	let isLoading = $derived($p2pOrderStore.isLoading);
	let errors = $derived($p2pOrderStore.errors);
	let currentExchanges = $derived(filterExchangesArr(filterState.token));
</script>

<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
	{#each currentExchanges as exchange}
		<Card class="relative overflow-hidden transition-all duration-300 hover:shadow-md {errors[exchange.key] ? 'border-red-200 bg-red-50/30' : 'hover:border-primary/50'}">
			<CardHeader class="p-4 pb-2">
				<CardTitle class="flex items-center justify-between text-sm font-bold">
					<span class="truncate">{exchange.name}</span>
					<div class="h-2 w-2 rounded-full {isLoading ? 'bg-amber-400 animate-pulse' : errors[exchange.key] ? 'bg-red-500' : 'bg-emerald-500'}"></div>
				</CardTitle>
			</CardHeader>
			<CardContent class="p-4 pt-0">
				<div class="text-xs text-muted-foreground mt-1 flex justify-between items-center">
					<span>Status</span>
					{#if isLoading}
						<span class="text-amber-600 font-medium">Fetching...</span>
					{:else if errors[exchange.key]}
						<span class="text-red-600 font-medium truncate max-w-[80px]" title={errors[exchange.key]?.message}>Error</span>
					{:else}
						<span class="text-emerald-600 font-medium">Active</span>
					{/if}
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
