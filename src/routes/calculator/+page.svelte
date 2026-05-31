<script lang="ts">
	import { Calculator, ArrowRight, DollarSign, Percent, TrendingUp, RefreshCw, AlertCircle } from 'lucide-svelte';

	let { data } = $props();

	let tradeAmount = $state(1000);
	let buyPrice = $state(data.buy);
	let sellPrice = $state(data.sell);
	
	// Fees
	let buyFeePercent = $state(0.10); // Standard Taker Fee
	let sellFeePercent = $state(0.00); // Standard Maker Fee
	let paymentMethodFixedFee = $state(0);
	let paymentMethodPercentFee = $state(0);

	// Reactive Engine
	const totalInvestment = $derived(tradeAmount * buyPrice);
	const buyCryptoReceived = $derived(tradeAmount * (1 - buyFeePercent / 100));
	
	const grossFiatReceived = $derived(buyCryptoReceived * sellPrice);
	const sellExchangeFeeFiat = $derived(grossFiatReceived * (sellFeePercent / 100));
	const paymentMethodFeeFiat = $derived(paymentMethodFixedFee + (grossFiatReceived * (paymentMethodPercentFee / 100)));
	
	const netFiatReceived = $derived(grossFiatReceived - sellExchangeFeeFiat - paymentMethodFeeFiat);
	const netProfit = $derived(netFiatReceived - totalInvestment);
	const roi = $derived(totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0);
</script>

<svelte:head>
	<title>{data.metaTitle}</title>
	<meta name="description" content={data.metaDescription} />
	<meta name="keywords" content="{data.crypto} {data.fiat} arbitrage calculator, P2P profit calculator, Binance P2P fees calculator, crypto spread calculator" />
	<link rel="canonical" href="https://p2pcompanion.com/calculator" />
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-emerald-300/10 dark:bg-emerald-900/20 blur-[120px]"></div>
	<div class="absolute -bottom-[10%] right-[10%] h-[60%] w-[40%] rounded-full bg-blue-300/10 dark:bg-blue-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_32px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<main class="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8 pt-12 pb-32">
	<div class="text-center mb-10">
		<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 dark:bg-emerald-900/30 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm">
			<Calculator class="size-3.5" /> Margin Engine
		</span>
		<h1 class="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-4 leading-tight">
			{data.crypto}/{data.fiat} <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Net Profit</span> Calculator
		</h1>
		<p class="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto">
			Stop guessing your margins. Factor in exchange maker/taker fees and local payment method costs to reveal your actual take-home profit.
		</p>
	</div>

	<!-- Calculator Card -->
	<div class="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-white/60 dark:border-zinc-800 rounded-[32px] shadow-xl overflow-hidden mb-8">
		
		<div class="p-6 sm:p-10 space-y-10">
			<!-- Primary Trade Settings -->
			<div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
				<div class="md:col-span-4">
					<label class="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Trade Amount ({data.crypto})</label>
					<div class="relative">
						<input type="number" bind:value={tradeAmount} class="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 font-black text-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" />
					</div>
				</div>
				<div class="md:col-span-3">
					<label class="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Buy Price ({data.fiat})</label>
					<input type="number" step="0.001" bind:value={buyPrice} class="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 font-black text-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" />
				</div>
				<div class="md:col-span-2 flex justify-center pb-4 hidden md:flex">
					<div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400"><ArrowRight class="size-5" /></div>
				</div>
				<div class="md:col-span-3">
					<label class="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Sell Price ({data.fiat})</label>
					<input type="number" step="0.001" bind:value={sellPrice} class="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 font-black text-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" />
				</div>
			</div>

			<hr class="border-zinc-200/60 dark:border-zinc-800/60" />

			<!-- Advanced Fees Configuration -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="space-y-4">
					<h3 class="text-sm font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2"><RefreshCw class="size-4 text-blue-500" /> Exchange Fees</h3>
					<div class="flex gap-4">
						<div class="flex-1">
							<label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Buy Order (%)</label>
							<input type="number" step="0.01" bind:value={buyFeePercent} class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
						</div>
						<div class="flex-1">
							<label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Sell Order (%)</label>
							<input type="number" step="0.01" bind:value={sellFeePercent} class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
						</div>
					</div>
				</div>

				<div class="space-y-4">
					<h3 class="text-sm font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2"><DollarSign class="size-4 text-emerald-500" /> Payment Method Fees</h3>
					<div class="flex gap-4">
						<div class="flex-1">
							<label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Fixed Cost ({data.fiat})</label>
							<input type="number" step="0.5" bind:value={paymentMethodFixedFee} class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
						</div>
						<div class="flex-1">
							<label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Percent Cost (%)</label>
							<input type="number" step="0.1" bind:value={paymentMethodPercentFee} class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Results Dashboard -->
		<div class="bg-zinc-900 dark:bg-black p-8 sm:p-10 text-white relative overflow-hidden">
			<div class="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
			
			<div class="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
				<div><p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Capital Deployed</p><p class="text-xl font-black">{totalInvestment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} <span class="text-xs text-zinc-500">{data.fiat}</span></p></div>
				<div><p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Crypto Secured</p><p class="text-xl font-black">{buyCryptoReceived.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:4})} <span class="text-xs text-zinc-500">{data.crypto}</span></p></div>
				<div><p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Fees Lost</p><p class="text-xl font-black text-rose-400">-{(sellExchangeFeeFiat + paymentMethodFeeFiat + (tradeAmount - buyCryptoReceived) * buyPrice).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} <span class="text-xs text-rose-500/50">{data.fiat}</span></p></div>
				<div><p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Return on Inv.</p><p class="text-xl font-black flex items-center gap-1.5 {roi > 0 ? 'text-emerald-400' : 'text-rose-400'}"><TrendingUp class="size-4" /> {roi.toFixed(2)}%</p></div>
			</div>

			<div class="relative z-10 pt-8 border-t border-zinc-800/80">
				<p class="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Final Net Profit</p>
				<p class="text-5xl sm:text-7xl font-black {netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'} tracking-tighter drop-shadow-lg">
					{netProfit > 0 ? '+' : ''}{netProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} <span class="text-2xl text-zinc-500 tracking-normal">{data.fiat}</span>
				</p>
			</div>
		</div>
	</div>
	
	<div class="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 text-amber-800 dark:text-amber-200/80 text-sm">
		<AlertCircle class="size-5 shrink-0 mt-0.5 text-amber-500" />
		<p><strong>Note:</strong> Some exchanges apply maker fees only to verified merchants. Ensure you check the exact fee tier on the platform before executing a large volume trade.</p>
	</div>
</main>
