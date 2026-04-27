<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { AlertCircle, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-svelte';
	import { p2pOrderStore } from '$lib/p2p-orders';
	import { filterStore } from '$lib/components/filter/stateFilter.svelte';

	// Safe reactive references to the store
	let state = $state(p2pOrderStore);
	let orders = $derived($state.orders || []);
	let isLoading = $derived($state.isLoading);
	let errors = $derived($state.errors || {});
	let marketRate = $derived($state.marketRate);
	
	// Safely watch the filter store
	let filters = $derived(filterStore.filters);

	function formatPrice(price: number, fiat: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: fiat,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(price);
	}

	function getSpread(price: number, market: number) {
		if (!market) return 0;
		return ((price - market) / market) * 100;
	}

	function getExchangeColor(exchange: string) {
		switch (exchange.toLowerCase()) {
			case 'binance': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
			case 'okx': return 'bg-neutral-900/10 text-neutral-900 border-neutral-200';
			case 'bybit': return 'bg-amber-500/10 text-amber-700 border-amber-200';
			case 'bitget': return 'bg-cyan-500/10 text-cyan-700 border-cyan-200';
			case 'mexc': return 'bg-blue-600/10 text-blue-700 border-blue-200';
			case 'kucoin': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
			case 'remitano': return 'bg-purple-600/10 text-purple-700 border-purple-200';
			default: return 'bg-slate-100 text-slate-700 border-slate-200';
		}
	}
</script>

<div class="rounded-xl border bg-white shadow-sm overflow-hidden">
	{#if Object.keys(errors).length > 0}
		<div class="bg-red-50/50 p-3 border-b border-red-100">
			<div class="flex items-center gap-2 text-red-600 text-xs font-medium">
				<AlertCircle class="h-4 w-4" />
				<span>Some exchanges failed to load. Results may be incomplete.</span>
			</div>
		</div>
	{/if}

	<div class="overflow-x-auto">
		<Table>
			<TableHeader>
				<TableRow class="bg-slate-50/50 hover:bg-slate-50/50">
					<TableHead class="w-[120px] font-semibold text-slate-600">Exchange</TableHead>
					<TableHead class="font-semibold text-slate-600">Price</TableHead>
					<TableHead class="font-semibold text-slate-600">Merchant</TableHead>
					<TableHead class="font-semibold text-slate-600">Available</TableHead>
					<TableHead class="text-right font-semibold text-slate-600">Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if isLoading}
					{#each Array(5) as _}
						<TableRow>
							<TableCell><div class="h-6 w-20 animate-pulse rounded-md bg-slate-100"></div></TableCell>
							<TableCell><div class="h-6 w-24 animate-pulse rounded-md bg-slate-100"></div></TableCell>
							<TableCell><div class="h-6 w-32 animate-pulse rounded-md bg-slate-100"></div></TableCell>
							<TableCell><div class="h-6 w-24 animate-pulse rounded-md bg-slate-100"></div></TableCell>
							<TableCell><div class="flex justify-end"><div class="h-8 w-20 animate-pulse rounded-lg bg-slate-100"></div></div></TableCell>
						</TableRow>
					{/each}
				{:else if orders.length === 0}
					<TableRow>
						<TableCell colspan="5" class="h-32 text-center text-slate-500">
							No active orders found for this combination.
						</TableCell>
					</TableRow>
				{:else}
					{#each orders as order}
						<TableRow class="group hover:bg-slate-50/80 transition-colors">
							<TableCell>
								<Badge variant="outline" class="{getExchangeColor(order.exchange)} border whitespace-nowrap">
									{order.exchange}
								</Badge>
							</TableCell>
							<TableCell>
								<div class="flex flex-col">
									<span class="font-bold text-slate-900">{formatPrice(order.price, order.fiat)}</span>
									{#if marketRate}
										{@const spread = getSpread(order.price, marketRate)}
										<span class="flex items-center gap-0.5 text-[10px] font-medium {spread > 0 ? 'text-red-500' : 'text-emerald-500'}">
											{#if spread > 0}<TrendingUp class="h-3 w-3" />{:else}<TrendingDown class="h-3 w-3" />{/if}
											{Math.abs(spread).toFixed(2)}% vs market
										</span>
									{/if}
								</div>
							</TableCell>
							<TableCell>
								<div class="flex flex-col">
									<span class="font-medium text-slate-900 truncate max-w-[150px]">{order.merchantName}</span>
									<span class="text-[11px] text-slate-500">
										{order.merchantStats.monthOrderCount} orders • {(order.merchantStats.positiveRate * 100).toFixed(0)}%
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div class="flex flex-col">
									<span class="font-medium text-slate-700">{order.available.toLocaleString()} {order.token}</span>
									<span class="text-[11px] text-slate-400">
										Limit: {order.minLimit.toLocaleString()} - {order.maxLimit.toLocaleString()} {order.fiat}
									</span>
								</div>
							</TableCell>
							<TableCell class="text-right">
								<Button 
									variant="default" 
									size="sm" 
									class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
									href={order.tradeUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span class="hidden sm:inline">{filters.type === 'buy' ? 'Buy' : 'Sell'} {order.token}</span>
									<span class="sm:hidden">{filters.type === 'buy' ? 'Buy' : 'Sell'}</span>
									<ArrowUpRight class="ml-1.5 h-3.5 w-3.5" />
								</Button>
							</TableCell>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</div>
</div>
