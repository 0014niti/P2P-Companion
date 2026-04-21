<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { filterExchangesArr } from '$lib/exchanges';
	import type { P2POrder } from '$lib/types';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';

	let {
		exchange,
		ads = [],
		isLoading = false,
		error = null
	}: {
		exchange: ReturnType<typeof filterExchangesArr>[number];
		ads?: P2POrder[];
		isLoading?: boolean;
		error?: Error | null;
	} = $props();

	let expandedAds = $state<Set<string>>(new Set());

	const toggleExpand = (advNo: string) => {
		expandedAds = new Set(
			expandedAds.has(advNo)
				? [...expandedAds].filter(id => id !== advNo)
				: [...expandedAds, advNo]
		);
	};
</script>

<Card class="hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
	<CardHeader class="p-2 md:p-3 border-b flex flex-row items-center justify-between space-y-0 bg-muted/20">
		<CardTitle class="flex items-center gap-2">
			<img
				src={exchange.icon}
				alt={exchange.name}
				class="size-5 rounded-sm border bg-background p-0.5 shadow-sm"
			/>
			<span class="font-bold text-sm md:text-base truncate tracking-tight">{exchange.name}</span>
		</CardTitle>
		<a
			href={exchange.p2pLink}
			target="_blank"
			rel="noopener noreferrer"
			class="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 bg-primary/10 px-2 py-1 rounded-md transition-colors hover:bg-primary/20"
			title={`Trade on ${exchange.name}`}
		>
			Trade <span class="text-[14px] leading-none">↗</span>
		</a>
	</CardHeader>

	<CardContent class="p-0 text-sm bg-background flex-1">
		{#if isLoading && ads.length === 0}
			<div class="divide-y">
				{#each Array(5) as _}
					<div class="p-3 space-y-2">
						<div class="flex justify-between items-center"><div class="h-4 bg-muted rounded w-1/3 animate-pulse"></div><div class="h-3 bg-muted rounded w-1/4 animate-pulse"></div></div>
						<div class="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
					</div>
				{/each}
			</div>
		{:else if error}
			<div class="text-red-500 flex items-center gap-2 p-3">
				<span class="text-lg">⚠️</span>
				<p class="text-xs">{error.message || 'Error loading data'}</p>
			</div>
		{:else if ads.length > 0}
			<div class="divide-y max-h-[60vh] md:max-h-[400px] overflow-y-auto hide-scrollbar">
				{#each ads as ad (ad.id)}
					<div
						class="p-2.5 hover:bg-muted/30 cursor-pointer transition-colors"
						role="button"
						tabindex="0"
						onclick={() => toggleExpand(ad.id)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(ad.id); }}
					>
						<!-- Ultra Compact 2-Line Header -->
						<div class="flex justify-between items-start">
							<div class="flex flex-col gap-0.5">
								<div class="font-bold text-primary text-[15px] leading-none flex items-center gap-1.5">
									{new Intl.NumberFormat('en-US', { style: 'currency', currency: ad.fiat }).format(Number(ad.price))}
									{#if ad.isRestricted}
										<span class="text-[8px] font-bold px-1 py-0.5 rounded-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 leading-none uppercase tracking-wider">Restricted</span>
									{:else}
										<span class="text-[8px] font-bold px-1 py-0.5 rounded-sm bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 leading-none uppercase tracking-wider">Tradable</span>
									{/if}
								</div>
								<div class="text-[11px] text-muted-foreground flex items-center gap-1.5">
									<span class="truncate max-w-[100px]" title={ad.merchantName}>{ad.merchantName}</span>
									{#if ad.merchantStats}
										<span class="text-emerald-600 dark:text-emerald-400 font-medium">
											{(ad.merchantStats.positiveRate * 100).toFixed(0)}%
										</span>
									{/if}
								</div>
							</div>
							<div class="flex flex-col items-end gap-1 text-right">
								<div class="text-[11px] font-medium text-foreground tracking-tight">
									{new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(ad.minLimit)} - {new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(ad.maxLimit)}
								</div>
								<ChevronDown class={cn('size-3.5 text-muted-foreground transition-transform', { 'rotate-180': expandedAds.has(ad.id) })} />
							</div>
						</div>

						<!-- Always-visible Terms snippet -->
						<div class="mt-1.5 text-[10px] text-muted-foreground/70 line-clamp-1 italic">
							{ad.terms?.trim() ? ad.terms.replace(/\n/g, ' ').trim() : 'No terms specified'}
						</div>

						<!-- Expandable Details -->
						{#if expandedAds.has(ad.id)}
							<div class="mt-2 pt-2 border-t text-[11px] space-y-1.5">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Available:</span>
									<span class="font-medium">{ad.available.toLocaleString()} {ad.token}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Orders (30d):</span>
									<span class="font-medium">{ad.merchantStats?.monthOrderCount || 0}</span>
								</div>
								{#if ad.paymentMethods.length > 0}
									<div class="pt-1 flex flex-wrap gap-1">
										{#each ad.paymentMethods as payment}
											<Badge variant="outline" style={payment.bgColor ? `background-color: ${payment.bgColor}` : undefined} class={cn('text-[9px] px-1.5 py-0.5 h-auto border-transparent leading-tight', { 'text-white': !!payment.bgColor, 'text-foreground border-border': !payment.bgColor })}>
												{payment.name}
											</Badge>
										{/each}
									</div>
								{/if}

								<div class="pt-1.5 mt-1.5 border-t border-muted/50">
									<span class="text-[10px] text-muted-foreground block mb-0.5 font-medium">Merchant Terms:</span>
									<div class="text-[10px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
										{ad.terms?.trim() || 'No terms specified'}
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-muted-foreground text-xs text-center py-2">No ads available</p>
		{/if}
	</CardContent>
</Card>
