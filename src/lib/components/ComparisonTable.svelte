<script lang="ts">
	// This component expects an array of fetched P2P order data.
	import type { P2POrder } from '$lib/types';

	let {
		orders = [],
		isLoading = false
	}: {
		orders?: P2POrder[];
		isLoading?: boolean;
	} = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
	<table class="min-w-full text-left text-sm whitespace-nowrap">
		<thead class="bg-gray-50 uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
			<tr>
				<th scope="col" class="px-6 py-4 font-medium">Exchange / Merchant</th>
				<th scope="col" class="px-6 py-4 font-medium">Price</th>
				<th scope="col" class="px-6 py-4 font-medium">Available</th>
				<th scope="col" class="px-6 py-4 font-medium">Limits</th>
				<th scope="col" class="px-6 py-4 font-medium">Payment Methods</th>
				<th scope="col" class="px-6 py-4 text-right font-medium">Action</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200 dark:divide-gray-800">
			{#if isLoading}
				<tr>
					<td colspan="6" class="px-6 py-12 text-center text-gray-500">
						<div class="flex flex-col items-center justify-center space-y-3">
							<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
							<p>Fetching latest P2P data...</p>
						</div>
					</td>
				</tr>
			{:else if orders.length === 0}
				<tr>
					<td colspan="6" class="px-6 py-12 text-center text-gray-500">
						No offers available for the selected filters.
					</td>
				</tr>
			{:else}
				{#each orders as order (order.id)}
					<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
						<td class="px-6 py-4">
							<div class="font-medium text-gray-900 dark:text-gray-100">{order.exchange}</div>
							<div class="text-xs text-gray-500">{order.merchantName}</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-base font-bold text-gray-900 dark:text-gray-100">
								{order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span class="text-xs font-normal text-gray-500">{order.fiat}</span>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-gray-900 dark:text-gray-100">{order.available.toLocaleString()} <span class="text-xs text-gray-500">{order.token}</span></div>
						</td>
						<td class="px-6 py-4">
							<div class="text-gray-900 dark:text-gray-100">{order.minLimit.toLocaleString()} - {order.maxLimit.toLocaleString()} <span class="text-xs text-gray-500">{order.fiat}</span></div>
						</td>
						<td class="px-6 py-4">
							<div class="flex flex-wrap gap-1.5">
								{#each order.paymentMethods as { name: method }}
									<span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
										{method}
									</span>
								{/each}
							</div>
						</td>
						<td class="px-6 py-4 text-right">
							<a
								href={order.tradeUrl || '#'}
								target="_blank"
								rel="noreferrer"
								class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
							>
								Trade
							</a>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>