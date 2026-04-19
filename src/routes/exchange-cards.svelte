<script lang="ts">
	import { filterState, refreshTimers } from '$lib/components/filter/stateFilter.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { ExchangeP2PAd, filterExchangesArr } from '$lib/exchanges';
	import { fetchUrlBuilder } from '$lib/exchanges/url-builder';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import { createQuery } from '@tanstack/svelte-query';

	let {
		exchange
	}: {
		exchange: ReturnType<typeof filterExchangesArr>[number];
	} = $props();

	const filterStateSelectedToken = $derived(filterState.current.selectedToken);
	const filterStateType = $derived(filterState.current.type);
	const filterStateFiat = $derived(filterState.current.fiat);
	const refreshTimer = $derived(filterState.current.refreshTimer);

	let expandedAds = $state<Set<string>>(new Set());

	let ads = $derived.by(() =>
		createQuery<{ responses: null | ExchangeP2PAd[] }>({
			queryKey: ['ads', exchange.key, filterStateSelectedToken, filterStateType, filterStateFiat],
			queryFn: async () => {
				const res = await fetch(
					fetchUrlBuilder(
						{
							type: filterStateType,
							fiat: filterStateFiat,
							token: filterStateSelectedToken
						},
						exchange.key
					)
				);

				if (!res.ok) {
					throw new Error('Network response was not ok');
				}

				return (await res.json()) as { responses: null | ExchangeP2PAd[] };
			},
			refetchInterval: refreshTimer ? refreshTimers[refreshTimer].value : false,
			refetchIntervalInBackground: refreshTimer ? true : false
		})
	);

	const toggleExpand = (advNo: string) => {
		expandedAds = new Set(
			expandedAds.has(advNo)
				? [...expandedAds].filter(id => id !== advNo)
				: [...expandedAds, advNo]
		);
	};
</script>

<Card
	class="hover:shadow-lg hover:border-primary/50"
>
	<CardHeader class="pb-2">
		<CardTitle class="inline-flex items-center gap-2">
			<img
				src={exchange.icon}
				alt={exchange.name}
				class="size-8 rounded-md border bg-secondary p-0.5 shadow-sm"
			/>

			<span class="font-bold text-sm md:text-base truncate">{exchange.name}</span>
		</CardTitle>
	</CardHeader>

	<CardContent class="bg-secondary/30 py-3 text-sm">
		{#if $ads.isPending}
			<div class="space-y-2">
				<div class="h-6 bg-primary/10 rounded w-3/4"></div>
				<div class="h-3 bg-primary/10 rounded w-1/2"></div>
				<div class="h-3 bg-primary/10 rounded w-2/3"></div>
			</div>
		{:else if $ads.isError}
			<div class="text-red-500 flex items-center gap-2">
				<span class="text-lg">⚠️</span>
				<p class="text-xs">Error loading data</p>
			</div>
		{:else if $ads.data?.responses && $ads.data.responses.length > 0}
			<div class="space-y-2 max-h-96 overflow-y-auto">
				{#each $ads.data.responses as ad (ad.advNo)}
					<div
						class="border rounded-lg p-2 cursor-pointer bg-card hover:bg-primary/5"
						on:click={() => toggleExpand(ad.advNo)}
					>
						<!-- Basic Info Always Visible -->
						<div class="flex items-start justify-between gap-2 mb-2">
							<div class="flex-1">
								<div class="text-sm font-bold text-primary">
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: ad.fiatUnit
									}).format(Number(ad.price))}
								</div>
								<div class="text-xs text-muted-foreground line-clamp-1">
									{ad.advertiser.name}
								</div>
							</div>
							<ChevronDown class={cn('size-4 mt-1 flex-shrink-0', {
								'rotate-180': expandedAds.has(ad.advNo)
							})} />
						</div>

						<!-- Always Show Seller Rating -->
						<div class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mb-2">
							<span>✓</span>
							<span class="font-semibold">{ad.advertiser.monthOrderCount}</span>
							<span class="text-muted-foreground">trades •</span>
							<span class="font-semibold">{Number((ad.advertiser.positiveRate * 100).toFixed(2))}%</span>
						</div>

						<!-- Expandable Details -->
						{#if expandedAds.has(ad.advNo)}
							<div class="border-t pt-2 mt-2 space-y-2">
								<!-- Transaction Limits -->
								<div class="text-xs">
									<div class="text-muted-foreground font-medium">Limit:</div>
									<div class="text-foreground">
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: ad.fiatUnit
										}).format(Number(ad.minSingleTransAmount))} - {new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: ad.fiatUnit
										}).format(Number(ad.maxSingleTransAmount))}
									</div>
								</div>

								<!-- Payment Methods -->
								{#if ad.paymentMethods.length > 0}
									<div class="text-xs">
										<div class="text-muted-foreground font-medium mb-1">Payment:</div>
										<div class="flex flex-wrap gap-1">
											{#each ad.paymentMethods as payment}
												<Badge
													variant="outline"
													style={`${payment.bgColor ? `background-color: ${payment.bgColor}` : ''}`}
													class={cn('text-xs font-medium', {
														'text-neutral-50': !!payment.bgColor,
														'text-neutral-950 dark:text-neutral-50': !payment.bgColor
													})}
												>
													{payment.name}
												</Badge>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-muted-foreground text-xs text-center py-2">No ads available</p>
		{/if}
	</CardContent>

	<CardFooter class="border-t bg-secondary/30 py-2">
		<small>
			<a
				href={exchange.p2pLink}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary underline font-medium text-xs"
				title={`Trade on ${exchange.name}`}
			>
				Trade on {exchange.name} →
			</a>
		</small>
	</CardFooter>
</Card>
