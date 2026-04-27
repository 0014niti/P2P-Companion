<script lang="ts">
	import {
		Label,
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select';
	import fiatList from '$lib/data/binance-fiat-list.json';
	import { actionTypes, availableTokensList } from '$lib/exchanges';
	import {
		CheckIcon,
		ChevronsUpDownIcon
	} from 'lucide-svelte';
	import { Button } from '../ui/button';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList
	} from '../ui/command';
	import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

	import { cn } from '$lib/utils';
	import { filterState } from './stateFilter.svelte';

	let openFiatList = $state(false);

	const filterStateType = $derived(filterState.current.type);
	const filterStateSelectedToken = $derived(filterState.current.selectedToken);
	const filterStateFiat = $derived(filterState.current.fiat);
</script>

<div
	class="flex flex-col gap-3 rounded-lg border px-4 py-3 md:flex-row md:items-center md:gap-2 bg-gradient-to-r from-secondary/50 to-secondary/30 backdrop-blur-sm hover:border-primary/50"
>
	<div class="flex w-full flex-col items-start gap-2 md:flex-row md:items-center md:gap-2">
		<div class="w-full space-y-0.5 md:w-auto">
			<Label class="px-0 font-semibold text-xs">Type</Label>

			<Select type="single" bind:value={filterState.current.type}>
				<SelectTrigger class="w-full md:w-[85px] hover:border-primary/50 text-xs h-9">
					{actionTypes[filterStateType]}
				</SelectTrigger>

				<SelectContent class="w-full md:w-[85px]">
					<SelectItem value="buy">Buy</SelectItem>
					<SelectItem value="sell">Sell</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div class="w-full space-y-0.5 md:w-auto">
			<Label class="px-0 font-semibold text-xs">Token</Label>

			<Select type="single" bind:value={filterState.current.selectedToken}>
				<SelectTrigger class="w-full md:w-[100px] hover:border-primary/50 text-xs h-9">
					{filterStateSelectedToken}
				</SelectTrigger>

				<SelectContent class="w-full md:w-[100px]">
					{#each availableTokensList as token (token)}
						<SelectItem value={token}>{token}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>

		<div class="w-full space-y-0.5 md:w-auto">
			<Label class="px-0 font-semibold text-xs">Fiat</Label>

			<Popover>
				<PopoverTrigger>
					<Button
						role="combobox"
						aria-expanded={openFiatList}
						variant="outline"
						class="w-full justify-between md:w-[110px] hover:border-primary/50 text-xs h-9"
					>
						{filterStateFiat}
						<ChevronsUpDownIcon class={cn('ml-1 size-3 shrink-0 opacity-50', {
							'rotate-180': openFiatList
						})} />
					</Button>
				</PopoverTrigger>

				<PopoverContent class="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search Fiats..." />
						<CommandList>
							<CommandEmpty>No fiats found.</CommandEmpty>
							<CommandGroup>
								{#each fiatList as fiat (fiat.currencyCode)}
									<CommandItem
										value={fiat.currencyCode}
										onSelect={() => {
											filterState.current.fiat = fiat.currencyCode;
											openFiatList = false;
										}}
									>
										<CheckIcon
											class={cn('mr-2 size-4', {
												'text-transparent': filterStateFiat !== fiat.currencyCode
											})}
										/>

										{fiat.currencyCode}
									</CommandItem>
								{/each}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	</div>
</div>
