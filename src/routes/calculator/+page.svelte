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

	<!-- AdSense Thick Content & FAQ -->
	<article class="prose prose-zinc dark:prose-invert prose-emerald max-w-none mt-16 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-[32px] p-8 sm:p-12 shadow-sm">
		<h2 class="text-3xl font-black mb-6 text-zinc-900 dark:text-white text-center sm:text-left">How to Calculate True P2P Arbitrage Margins</h2>
		
		<p>Executing a successful cryptocurrency arbitrage route requires precision. While seeing a high "Sell" price and a low "Buy" price on the terminal is exciting, failing to account for hidden platform and banking fees will quickly turn a profitable strategy into a net loss.</p>
		
		<p>Our Net Profit Margin Engine is designed to eliminate guesswork. By simulating the entire trade lifecycle—from initial fiat deployment to the final withdrawal—this calculator ensures that your take-home yield is mathematically secure before you lock in any liquidity.</p>

		<h3 class="text-xl font-bold mt-8 mb-4">The Impact of Maker vs. Taker Fees</h3>
		<p>Almost all centralized peer-to-peer marketplaces employ a tiered fee structure designed to incentivize liquidity providers:</p>
		<ul>
			<li><strong>Taker Fees:</strong> Applied when you accept an advertisement already posted on the order book. Because you are instantly "taking" liquidity from the market, exchanges generally charge higher fees (typically 0.10% to 0.20%).</li>
			<li><strong>Maker Fees:</strong> Applied when you post a new advertisement and wait for another user to fill it. Because you are "making" liquidity for the exchange, you are often rewarded with lower fees (frequently 0.00% to 0.05%).</li>
		</ul>
		<p>To maximize your Return on Investment (ROI), the most common strategy is to purchase assets as a Taker on a low-fee exchange, and off-ramp them as a Maker on a high-volume exchange.</p>

		<hr class="my-10 border-zinc-200 dark:border-zinc-700" />

		<h3 class="text-2xl font-black mb-6 text-zinc-900 dark:text-white">Frequently Asked Questions</h3>
		
		<div class="space-y-4 not-prose">
			<div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-700/50">
				<h4 class="font-bold text-zinc-900 dark:text-zinc-100 text-[15px] mb-2">What does "Capital Deployed" mean?</h4>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">This represents the total amount of local fiat currency you must spend upfront to initiate the buy-side of the arbitrage route. It equals your inputted Trade Amount multiplied by your exact Buy Price.</p>
			</div>

			<div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-700/50">
				<h4 class="font-bold text-zinc-900 dark:text-zinc-100 text-[15px] mb-2">Are blockchain network transfer fees included?</h4>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">The calculator includes fields for fiat payment method fixed fees, but network transfer fees (e.g., sending USDT via TRC-20 from OKX to Binance) must be factored into the "Fixed Cost" input. Network fees generally range from $0.50 to $1.00 depending on the blockchain utilized.</p>
			</div>

			<div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-700/50">
				<h4 class="font-bold text-zinc-900 dark:text-zinc-100 text-[15px] mb-2">Why did my net profit turn red (negative)?</h4>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">A negative profit margin indicates that the combination of your Buy Price, Sell Price, and associated fees results in a financial loss. If your spread between the buy and sell rate is less than 0.50%, the exchange fees alone will often eclipse your potential earnings.</p>
			</div>

			<div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-700/50">
				<h4 class="font-bold text-zinc-900 dark:text-zinc-100 text-[15px] mb-2">How accurate is the Return on Investment (ROI)?</h4>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">The ROI displayed is mathematically exact based on the precise inputs you provide. However, you must guarantee that the merchant you trade with fulfills the order at the exact price listed before the order book shifts to guarantee the final yield.</p>
			</div>
		</div>
	</article>
</main>
