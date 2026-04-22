<script lang="ts">
	// This component expects an array of fetched P2P order data.
	import type { P2POrder } from '$lib/types';
	import { p2pOrderStore } from '$lib/p2p-orders';

	let {
		orders = [],
		isLoading = false
	}: {
		orders?: P2POrder[];
		isLoading?: boolean;
	} = $props();
</script>

<div class="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
	<table class="min-w-full text-left text-sm whitespace-nowrap">
		<thead class="bg-zinc-50/30 border-b border-zinc-200/60">
			<tr class="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
				<th scope="col" class="px-8 py-6">Exchange & Merchant</th>
				<th scope="col" class="px-8 py-6">Price</th>
				<th scope="col" class="px-8 py-6">Available</th>
				<th scope="col" class="px-8 py-6">Limits</th>
				<th scope="col" class="px-8 py-6">Payment Methods</th>
				<th scope="col" class="px-8 py-6 text-right">Action</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-zinc-100">
			{#if isLoading}
				<tr>
					<td colspan="6" class="px-8 py-20 text-center">
						<div class="flex flex-col items-center justify-center space-y-3">
							<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
							<p class="font-bold text-zinc-500 tracking-wide mt-2">Fetching Market Data...</p>
						</div>
					</td>
				</tr>
			{:else if orders.length === 0}
				<tr>
					<td colspan="6" class="px-8 py-20 text-center text-zinc-500 font-medium">
						No market offers match the current criteria.
					</td>
				</tr>
			{:else}
				{#each orders as order (order.id)}
					<tr class="transition-all duration-300 ease-out hover:bg-white/50 hover:backdrop-blur-xl group cursor-default">
						<td class="px-8 py-5">
							<div class="font-black text-zinc-900 text-[15px]">{order.exchange}</div>
							<div class="text-xs font-bold text-zinc-500 mt-0.5">{order.merchantName}</div>
							<div class="mt-2 max-w-[220px] truncate text-[11px] italic text-zinc-400 cursor-help" title={order.terms?.trim() || 'No terms specified'}>
								{order.terms?.trim() ? order.terms.replace(/\n/g, ' ').trim() : 'No terms specified'}
							</div>
						</td>
						<td class="px-8 py-5">
							<div class="text-[17px] font-black text-zinc-900 tracking-tight">
								{order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span class="text-[11px] font-bold text-zinc-400 uppercase ml-0.5">{order.fiat}</span>
							</div>
							{#if $p2pOrderStore.marketRate}
								{@const diff = ((order.price - $p2pOrderStore.marketRate) / $p2pOrderStore.marketRate) * 100}
								<div class="mt-1 text-[10px] font-bold uppercase tracking-wider {diff > 0 ? 'text-blue-500' : 'text-emerald-500'}" title="Premium vs Official Market Rate">
									{diff > 0 ? '+' : ''}{diff.toFixed(2)}% Spread
								</div>
							{/if}
						</td>
						<td class="px-8 py-5">
							<div class="font-bold text-zinc-700">{order.available.toLocaleString()} <span class="text-[10px] font-bold text-zinc-400 ml-0.5">{order.token}</span></div>
						</td>
						<td class="px-8 py-5">
							<div class="font-bold text-zinc-700">{new Intl.NumberFormat('en-US', { notation: 'compact' }).format(order.minLimit)} - {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(order.maxLimit)} <span class="text-[10px] font-bold text-zinc-400 ml-0.5">{order.fiat}</span></div>
						</td>
						<td class="px-8 py-5">
							<div class="flex flex-wrap gap-2 max-w-[250px]">
								{#each order.paymentMethods as { name: method }}
									<span class="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-600 border border-zinc-200/50">
										{method}
									</span>
								{/each}
							</div>
						</td>
						<td class="px-8 py-5 text-right">
							<a
								href={order.tradeUrl || '#'}
								target="_blank"
								rel="noreferrer"
								class="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-300 ease-out hover:bg-blue-700 hover:shadow-lg active:scale-95"
							>
								Trade ↗
							</a>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>