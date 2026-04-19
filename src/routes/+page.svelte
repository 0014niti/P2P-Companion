<script lang="ts">
	import FilterContainer from '$lib/components/filter/filter-container.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { filterExchangesArr } from '$lib/exchanges';
	import { cn } from '$lib/utils';
	import ExchangeCards from './exchange-cards.svelte';

	const filterStateSelectedToken = $derived(filterState.current.selectedToken);
</script>

<div class="space-y-4">
	<div>
		<FilterContainer />
	</div>

	<div>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max">
			{#each filterExchangesArr(filterStateSelectedToken) as exchange (exchange.key)}
				<div>
					<ExchangeCards {exchange} />
				</div>
			{/each}
		</div>
	</div>
</div>
