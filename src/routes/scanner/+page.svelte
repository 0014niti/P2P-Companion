<script lang="ts">
	import FilterContainer from '$lib/components/filter/filter-container.svelte';
	// CRITICAL FIX: Correct extension appended
	import { filterState } from '$lib/components/filter/stateFilter.svelte.ts';
	import ComparisonTable from '$lib/components/ComparisonTable.svelte';
	import ExchangeCards from './exchange-cards.svelte';
	import { p2pOrderStore } from '$lib/p2p-orders';

	// Svelte 5 effect that safely fetches new data whenever the user changes a filter!
	$effect(() => {
		if (filterState.fiat && filterState.token && filterState.type) {
			p2pOrderStore.fetchOrders({
				type: filterState.type,
				token: filterState.token,
				fiat: filterState.fiat
			});
		}
	});
</script>

<div class="space-y-6">
	<FilterContainer />
	<ExchangeCards />
	<ComparisonTable />
</div>
