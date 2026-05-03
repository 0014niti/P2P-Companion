<script lang="ts">
	// This component expects an array of fetched P2P order data.
	import type { P2POrder } from '$lib/types';
	import { p2pOrderStore } from '$lib/p2p-orders';
	import { cn } from '$lib/utils';
	import { ShieldCheck } from 'lucide-svelte';

	let {
		orders = [],
		isLoading = false
	}: {
		orders?: P2POrder[];
		isLoading?: boolean;
	} = $props();

	// State to track which order terms are currently expanded
	let expandedTerms = $state<Set<string>>(new Set());

	const toggleTerms = (orderId: string) => {
		expandedTerms = new Set(
			expandedTerms.has(orderId)
				? [...expandedTerms].filter(id => id !== orderId)
				: [...expandedTerms, orderId]
		);
	};
</script>

<div class="overflow-x-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm">
	<table class="min-w-full text-left text-sm whitespace-nowrap">
		<thead class="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-200/60 dark:border-zinc-700/60">
			<tr class="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
				<th scope="col" class="px-5 py-3.5">Exchange & Merchant</th>
				<th scope="col" class="px-5 py-3.5">Price</th>
				<th scope="col" class="px-5 py-3.5">Available</th>
				<th scope="col" class="px-5 py-3.5">Limits</th>
				<th scope="col" class="px-5 py-3.5">Payment Methods</th>
				<th scope="col" class="px-5 py-3.5 text-right">Action</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/80">
			{#if isLoading}
				<tr>
					<td colspan="6" class="px-5 py-16 text-center">
						<div class="flex flex-col items-center justify-center space-y-3">
							<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
							<p class="text-xs font-bold text-zinc-500 tracking-widest uppercase mt-2">Fetching Market Data...</p>
						</div>
					</td>
				</tr>
			{:else if orders.length === 0}
				<tr>
					<td colspan="6" class="px-5 py-16 text-center text-zinc-500 font-medium text-xs">
						No market offers match the current criteria.
					</td>
				</tr>
			{:else}
				{#each orders as order (order.id)}
					<tr class="transition-colors duration-200 ease-out hover:bg-white dark:hover:bg-zinc-800/50 group cursor-default">
						<td class="px-5 py-3">
							<div class="flex flex-col gap-1 w-full max-w-[220px]">
								<div class="flex items-center gap-1.5 w-full">
									<span class="font-bold text-[12px] text-zinc-800 dark:text-zinc-200 truncate" title={order.merchantName}>{order.merchantName}</span>
									{#if order.isNewUserOnly}
										<span class="text-[8px] font-bold px-1 py-[1px] rounded border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wider shrink-0">New</span>
									{/if}
								</div>
								<div class="flex items-center gap-1.5">
									<span class="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-700 shadow-sm">{order.exchange}</span>
									{#if order.merchantStats}
										<span class="flex items-center gap-0.5 text-[9px] font-black text-emerald-600" title="Merchant Completion Rate">
											<ShieldCheck class="size-2.5" />
											{(order.merchantStats.positiveRate * 100).toFixed(0)}%
										</span>
									{/if}
								</div>
							<div 
								class={cn(
									"mt-1.5 text-[10px] italic text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200", 
									expandedTerms.has(order.id) ? "whitespace-pre-wrap break-words" : "truncate"
								)} 
								title="Click to expand/collapse terms"
								role="button"
								tabindex="0"
								onclick={() => toggleTerms(order.id)}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTerms(order.id); }}
							>
								{order.terms?.trim() ? (expandedTerms.has(order.id) ? order.terms.trim() : order.terms.replace(/\n/g, ' ').trim()) : 'No terms specified'}
							</div>
							</div>
						</td>
						<td class="px-5 py-3">
							<div class="flex flex-col gap-1 w-fit">
								<div class="text-[14px] font-black text-zinc-900 tracking-tight tabular-nums leading-none">
									{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{order.fiat}</span>
								</div>
								{#if $p2pOrderStore.marketRate}
									{@const diff = ((Number(order.price) - $p2pOrderStore.marketRate) / $p2pOrderStore.marketRate) * 100}
									<div class="w-fit text-[8px] font-black uppercase tracking-widest px-1.5 py-[1.5px] rounded border {diff > 0 ? 'bg-blue-50/50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'}" title="Premium vs Official Market Rate">
										{diff > 0 ? '+' : ''}{diff.toFixed(2)}%
									</div>
								{/if}
							</div>
						</td>
						<td class="px-5 py-3">
							<div class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">{new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(order.available)} <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 ml-0.5">{order.token}</span></div>
						</td>
						<td class="px-5 py-3">
							<div class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">{new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(order.minLimit)} - {new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(order.maxLimit)} <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 ml-0.5">{order.fiat}</span></div>
						</td>
						<td class="px-5 py-3">
							<div class="flex flex-wrap gap-1 max-w-[220px]">
								{#each order.paymentMethods as payment}
									<span 
										style={payment.bgColor ? `background-color: ${payment.bgColor}15; color: ${payment.bgColor}; border-color: ${payment.bgColor}30` : undefined} 
										class={cn('text-[9px] px-1.5 py-0.5 rounded border font-bold whitespace-nowrap', !payment.bgColor && 'text-zinc-600 bg-zinc-50 border-zinc-200/80 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 shadow-sm')}
									>
										{payment.name}
									</span>
								{/each}
							</div>
						</td>
						<td class="px-5 py-3 text-right">
							<a
								href={order.p2pLink || order.tradeUrl || '#'}
								target="_blank"
								rel="noreferrer"
								class="inline-flex text-[11px] font-bold text-blue-700 dark:text-blue-400 items-center gap-1 bg-gradient-to-b from-white to-blue-50 dark:from-zinc-800 dark:to-blue-900/20 border border-blue-200/80 dark:border-blue-800/50 px-3.5 py-1.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:to-blue-100 dark:hover:to-blue-900/40 hover:shadow active:scale-95"
							>
								Trade ↗
							</a>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div> n