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
	import { p2pOrderStore } from '$lib/p2p-orders';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

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

<Card class="hover:shadow-xl transition-all duration-500 ease-out overflow-hidden flex flex-col h-full bg-white/80 backdrop-blur-xl border border-zinc-200/60 shadow-sm rounded-2xl">
	<CardHeader class="p-4 md:p-5 border-b border-zinc-200/50 flex flex-row items-center justify-between space-y-0 bg-white/30">
		<CardTitle class="flex items-center gap-2">
			<img
				src={exchange.icon}
				alt={exchange.name}
				class="size-6 md:size-7 rounded-xl border border-zinc-200/60 bg-white p-1 shadow-sm"
			/>
			<span class="font-black text-base truncate tracking-tight text-zinc-900">{exchange.name}</span>
		</CardTitle>
		<a
			href={exchange.p2pLink}
			target="_blank"
			rel="noopener noreferrer"
			class="text-[11px] font-bold text-blue-700 flex items-center gap-1 bg-blue-50 border border-blue-100 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:bg-blue-100 active:scale-95"
			title={`Trade on ${exchange.name}`}
		>
			Trade <span class="text-[12px] leading-none">↗</span>
		</a>
	</CardHeader>

	<CardContent class="p-0 text-sm bg-transparent flex-1">
		{#if isLoading && ads.length === 0}
			<div class="divide-y divide-zinc-100">
				{#each Array(5) as _}
					<div class="p-3 md:p-4 space-y-2">
						<div class="flex justify-between items-center"><div class="h-4 bg-zinc-200/60 rounded w-1/3 animate-pulse"></div><div class="h-3 bg-zinc-200/60 rounded w-1/4 animate-pulse"></div></div>
						<div class="h-3 bg-zinc-100/60 rounded w-1/2 animate-pulse"></div>
					</div>
				{/each}
			</div>
		{:else if error}
			<div class="text-red-500 flex items-center gap-2 p-3">
				<span class="text-lg">⚠️</span>
				<p class="text-xs">{error.message || 'Error loading data'}</p>
			</div>
		{:else if ads.length > 0}
			<div class="divide-y divide-zinc-100/80 max-h-[65vh] md:max-h-[400px] overflow-y-auto overscroll-contain hide-scrollbar">
				{#each ads as ad (ad.id)}
					<div
						class="p-4 hover:bg-zinc-50/80 border-b border-zinc-100 last:border-0 cursor-pointer transition-all duration-300 ease-out active:bg-zinc-100/80 group"
						role="button"
						tabindex="0"
						onclick={() => toggleExpand(ad.id)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(ad.id); }}
					>
						<!-- Ultra Compact 2-Line Header -->
						<div class="flex justify-between items-start">
							<div class="flex flex-col gap-1">
								<div class="font-black text-zinc-900 text-[17px] md:text-[18px] tracking-tight leading-none flex items-center gap-1.5">
									{Number(ad.price).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span class="text-[10px] font-bold text-zinc-400 mt-1 uppercase">{ad.fiat}</span>
									{#if ad.isNewUserOnly}
										<span class="text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-600 leading-none uppercase tracking-wider shadow-sm">New User</span>
									{/if}
								</div>
								{#if $p2pOrderStore.marketRate}
									{@const diff = ((Number(ad.price) - $p2pOrderStore.marketRate) / $p2pOrderStore.marketRate) * 100}
									<div class="text-[10px] font-bold uppercase tracking-wider mt-1 {diff > 0 ? 'text-blue-500' : 'text-emerald-500'}" title="Premium vs Official Market Rate">
										{diff > 0 ? '+' : ''}{diff.toFixed(2)}% vs market
									</div>
								{/if}
								<div class="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5">
									<span class="truncate max-w-[140px]" title={ad.merchantName}>{ad.merchantName}</span>
									{#if ad.merchantStats}
										<span class="text-emerald-600 font-bold">
											{(ad.merchantStats.positiveRate * 100).toFixed(0)}%
										</span>
									{/if}
								</div>
							</div>
							<div class="flex flex-col items-end gap-1 text-right">
								<div class="text-[11px] font-bold text-zinc-600 tracking-tight bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200/50">
									{new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(ad.minLimit)} - {new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(ad.maxLimit)}
								</div>
								<ChevronDown class={cn('size-4 mt-1.5 text-zinc-400 group-hover:text-zinc-600 transition-all duration-300 ease-out', { 'rotate-180 text-zinc-900': expandedAds.has(ad.id) })} />
							</div>
						</div>

						<!-- Always-visible Terms snippet (Clickable) -->
						<div class="mt-2.5 text-[10px] text-zinc-400 font-medium line-clamp-1 italic group-hover:text-zinc-500 transition-colors">
							{ad.terms?.trim() ? ad.terms.replace(/\n/g, ' ').trim() : 'No terms specified'}
						</div>
						<!-- Expandable Details -->
						{#if expandedAds.has(ad.id)}
							<div transition:slide={{ duration: 300, easing: cubicOut }} class="mt-4 pt-4 border-t border-zinc-100 text-[11px] space-y-2.5">
								<div class="flex justify-between">
									<span class="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Available</span>
									<span class="font-black text-zinc-700">{ad.available.toLocaleString()} {ad.token}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Orders (30d)</span>
									<span class="font-black text-zinc-700">{ad.merchantStats?.monthOrderCount || 0}</span>
								</div>
								{#if ad.paymentMethods.length > 0}
									<div class="pt-2 flex flex-wrap gap-1.5">
										{#each ad.paymentMethods as payment}
											<Badge variant="outline" style={payment.bgColor ? `background-color: ${payment.bgColor}` : undefined} class={cn('text-[9px] px-2.5 py-1 rounded-md h-auto border border-zinc-200/50 leading-tight font-bold shadow-sm', { 'text-white': !!payment.bgColor, 'text-zinc-600 bg-zinc-50': !payment.bgColor })}>
												{payment.name}
											</Badge>
										{/each}
									</div>
								{/if}

								<div class="pt-3 mt-3 border-t border-zinc-100">
									<span class="text-[9px] text-zinc-400 block mb-1.5 font-bold uppercase tracking-widest">Merchant Terms</span>
									<div class="text-[10px] text-zinc-600 whitespace-pre-wrap leading-relaxed p-3 bg-zinc-50 rounded-xl border border-zinc-200/50">
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
