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
	class="relative flex flex-col gap-4 rounded-[20px] border border-white/40 dark:border-white/10 px-5 py-4 md:flex-row md:items-center md:gap-5 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out overflow-hidden group"
>
	<div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

	<div class="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:gap-4 relative z-10">
		
		<div class="w-full space-y-1.5 md:w-auto">
			<Label class="px-1 font-bold text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Type</Label>

			<Select type="single" bind:value={filterState.current.type}>
				<SelectTrigger class="w-full md:w-[100px] h-10 text-xs font-bold text-zinc-800 bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm">
					{actionTypes[filterStateType]}
				</SelectTrigger>

				<SelectContent class="w-full md:w-[100px] rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/30 shadow-2xl">
					<SelectItem value="buy" class="text-xs font-bold rounded-lg cursor-pointer">Buy</SelectItem>
					<SelectItem value="sell" class="text-xs font-bold rounded-lg cursor-pointer">Sell</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div class="w-full space-y-1.5 md:w-auto">
			<Label class="px-1 font-bold text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Token</Label>

			<Select type="single" bind:value={filterState.current.selectedToken}>
				<SelectTrigger class="w-full md:w-[110px] h-10 text-xs font-bold text-zinc-800 bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm">
					{filterStateSelectedToken}
				</SelectTrigger>

				<SelectContent class="w-full md:w-[110px] rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/30 shadow-2xl">
					{#each availableTokensList as token (token)}
						<SelectItem value={token} class="text-xs font-bold rounded-lg cursor-pointer">{token}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>

		<div class="w-full space-y-1.5 md:w-auto">
			<Label class="px-1 font-bold text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Fiat</Label>

			<Popover bind:open={openFiatList}>
				<PopoverTrigger asChild let:builder>
					<Button
						builders={[builder]}
						role="combobox"
						aria-expanded={openFiatList}
						variant="outline"
						class="w-full justify-between md:w-[130px] h-10 text-xs font-bold text-zinc-800 bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm"
					>
						{filterStateFiat}
						<ChevronsUpDownIcon class={cn('ml-1 size-3.5 shrink-0 text-zinc-400 transition-transform duration-300', {
							'rotate-180 text-zinc-800 dark:text-zinc-200': openFiatList
						})} />
					</Button>
				</PopoverTrigger>

				<PopoverContent class="w-[220px] p-0 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/30 shadow-2xl">
					<Command class="bg-transparent">
						<CommandInput placeholder="Search Fiats..." class="text-xs h-10 font-medium" />
						<CommandList class="max-h-[220px] overflow-y-auto scrollbar-thin">
							<CommandEmpty class="text-xs py-4 text-center text-zinc-500">No fiats found.</CommandEmpty>
							<CommandGroup>
								{#each fiatList as fiat (fiat.currencyCode)}
									<CommandItem
										value={fiat.currencyCode}
										onSelect={() => {
											filterState.current.fiat = fiat.currencyCode;
											openFiatList = false;
										}}
										class="text-xs font-bold rounded-lg cursor-pointer aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 transition-colors"
									>
										<CheckIcon
											class={cn('mr-2 size-4 text-blue-600 transition-opacity duration-200', {
												'opacity-0': filterStateFiat !== fiat.currencyCode,
												'opacity-100': filterStateFiat === fiat.currencyCode
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

<style>
	/* Make the popover command list scrollbar look premium */
	:global(.scrollbar-thin::-webkit-scrollbar) {
		width: 4px;
	}
	:global(.scrollbar-thin::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(.scrollbar-thin::-webkit-scrollbar-thumb) {
		background: #d4d4d8;
		border-radius: 10px;
	}
	:global(.scrollbar-thin::-webkit-scrollbar-thumb:hover) {
		background: #a1a1aa;
	}
</style>