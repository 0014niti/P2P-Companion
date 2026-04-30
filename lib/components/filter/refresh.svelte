<script lang="ts">
	import { Label, Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
	import { filterState, refreshTimers, refreshTimersArr } from './stateFilter.svelte';

	const filterStateRefreshTimer = $derived(filterState.current.refreshTimer);
</script>

<div class="space-y-1">
	<div class="flex items-center justify-between">
		<Label class="px-0">Refresh Timer</Label>
	</div>

	<Select type="single" bind:value={filterState.current.refreshTimer}>
		<SelectTrigger class="w-[150px]">
			{filterStateRefreshTimer ? refreshTimers[filterStateRefreshTimer].label : 'Select'}
		</SelectTrigger>

		<SelectContent class="w-[150px]">
			<SelectItem value={null as any}>DISABLED</SelectItem>

			{#each refreshTimersArr as timer}
				<SelectItem value={timer.key}>{timer.label}</SelectItem>
			{/each}
		</SelectContent>
	</Select>
</div>
