<script>
	import { onMount } from 'svelte';
	// Initialize Google AdSense banner after the component mounts
	onMount(() => {
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error('AdSense initialization error:', err);
		}
	});
</script>

<svelte:head>
	<title>Premium Crypto P2P Arbitrage Scanner | Live USDT Spreads</title>
	<meta name="description" content="A 100% free, no-login crypto arbitrage terminal. Experience a premium UI while comparing real-time P2P USDT prices across Binance, OKX, and Bybit." />
	<meta name="keywords" content="free crypto arbitrage, no login P2P scanner, premium crypto UI, USDT arbitrage scanner, Binance P2P, OKX P2P, fiat off-ramp" />
	
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "P2P Companion",
			"url": "https://p2pcompanion.vercel.app/",
			"description": "Global crypto arbitrage terminal to compare real-time P2P stablecoin prices across major centralized exchanges.",
			"applicationCategory": "FinanceApplication",
			"genre": "Cryptocurrency Arbitrage Scanner",
			"operatingSystem": "WebBrowser",
			"offers": {
				"@type": "Offer",
				"price": "0.00",
				"priceCurrency": "USD"
			},
			"creator": {
				"@type": "Organization",
				"name": "P2P Companion"
			}
		}
	</script>

	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
	<div class="absolute -top-[10%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-300/20 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[15%] h-[60%] w-[50%] rounded-full bg-indigo-300/20 blur-[120px]"></div>
	<div class="absolute -bottom-[10%] left-[20%] h-[60%] w-[60%] rounded-full bg-sky-200/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<header class="sticky top-4 z-50 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-6">
	<div class="flex items-center justify-between rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl px-4 py-3 shadow-lg shadow-slate-200/40">
		<div class="flex items-center gap-2">
			<div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-inner">
				<span class="text-white font-black text-sm">P2P</span>
			</div>
			<span class="font-black tracking-tight text-zinc-900 hidden sm:block">Companion</span>
		</div>
		
		<a href="/scanner" class="relative inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 group overflow-hidden">
			<span class="absolute inset-0 -translate-x-full animate-[sweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
			<span class="relative z-10 flex items-center gap-2">
				Open P2P Comparison Tool <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
			</span>
		</a>
	</div>
</header>

<main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pb-12">
	
	<div class="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
		
		<div class="md:col-span-8 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-8 lg:p-10 shadow-xl shadow-slate-200/30 flex flex-col justify-center relative overflow-hidden group">
			<div class="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
				<svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" class="text-blue-600"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
			</div>
			<span class="inline-flex items-center gap-1.5 w-fit rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4">
				<span class="relative flex h-1.5 w-1.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span></span>
				Live Market Data
			</span>
			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-950 leading-[1.05] mb-4">
				Maximize Every <br/>
				<span class="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700">Crypto Spread.</span>
			</h1>
			<p class="text-zinc-700 text-base sm:text-lg font-medium max-w-lg">
				Instantly compare real-time USDT prices across top global exchanges. Automate your fiat off-ramp discovery.
			</p>
		</div>

		<div class="md:col-span-4 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-4 shadow-xl shadow-slate-200/30 flex flex-col items-center justify-center min-h-[250px] relative">
			<span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-zinc-400">Sponsored</span>
			<div class="w-full h-full rounded-2xl bg-white/50 border border-zinc-100 flex items-center justify-center overflow-hidden">
				<ins class="adsbygoogle"
					style="display:block; text-align:center; width:100%; height:100%;"
					data-ad-layout="in-article"
					data-ad-format="fluid"
					data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
					data-ad-slot="YOUR_AD_SLOT_ID"></ins>
			</div>
		</div>

		<article class="md:col-span-6 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-8 shadow-xl shadow-slate-200/30 flex flex-col justify-center space-y-4">
			<h2 class="text-2xl font-black tracking-tight text-zinc-950">Frictionless Arbitrage</h2>
			<div class="space-y-3">
				<p class="text-zinc-700 text-sm leading-relaxed">
					Cryptocurrency liquidity is heavily fragmented. Depending on regional demand, stablecoins like USDT fluctuate independently across major centralized exchanges like Binance, OKX, and Bybit. 
				</p>
				<p class="text-zinc-700 text-sm leading-relaxed">
					Our <strong>100% free-to-use</strong> terminal aggregates global order books into a sleek, premium interface with <strong>no login or account required</strong>. We instantly calculate optimal maker and taker spreads, ensuring maximum capital efficiency without manual searching.
				</p>
			</div>
		</article>

		<div class="md:col-span-6 rounded-[32px] border border-indigo-100/50 bg-indigo-50/30 backdrop-blur-2xl p-8 shadow-xl shadow-indigo-100/20 flex flex-col relative overflow-hidden group">
			<div class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>

			<div class="flex items-center justify-between mb-6 relative z-10">
				<div>
					<h2 class="text-2xl font-black tracking-tight text-zinc-950">Terminal Roadmap</h2>
					<p class="text-xs font-semibold text-indigo-600/80 uppercase tracking-widest mt-1">Help shape the future</p>
				</div>
				<span class="rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
					<span class="relative flex h-1.5 w-1.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span></span>
					Building
				</span>
			</div>
			
			<ul class="space-y-4 flex-grow relative z-10 border-l-2 border-indigo-200/50 ml-2 pl-5">
				<li class="relative group cursor-default">
					<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
					<div class="p-3.5 rounded-xl bg-white/70 border border-white/60 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white">
						<h3 class="text-sm font-bold text-zinc-900 leading-tight">V1: P2P Aggregation Engine</h3>
						<p class="text-[11px] text-zinc-500 font-medium mt-1">Live market data & basic spread calculator (Current)</p>
					</div>
				</li>

				<li class="relative group cursor-default">
					<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
					<div class="p-3.5 rounded-xl border border-indigo-200/60 bg-gradient-to-br from-white/80 to-indigo-50/50 shadow-sm transition-all duration-300 transform group-hover:translate-x-1 group-hover:shadow-md group-hover:border-indigo-300">
						<div class="flex justify-between items-start mb-1">
							<h3 class="text-sm font-bold text-indigo-950 leading-tight">V2: Premium Arbitrage Intel</h3>
							<span class="text-[9px] font-black text-indigo-700 uppercase bg-indigo-100/80 border border-indigo-200 px-1.5 py-0.5 rounded">Up Next</span>
						</div>
						<p class="text-[11px] text-zinc-600 font-medium mt-1">Curated signals, API endpoints, & guided trading pairs.</p>
					</div>
				</li>

				<li class="relative group cursor-default">
					<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-300/20"></div>
					<div class="p-3.5 rounded-xl border border-white/50 bg-white/40 shadow-sm transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:bg-white/60">
						<div class="flex justify-between items-start mb-1">
							<h3 class="text-sm font-bold text-zinc-800 leading-tight">V3: Volatility Alerts & APIs</h3>
							<span class="text-[9px] font-bold text-zinc-500 uppercase bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">Planned</span>
						</div>
						<p class="text-[11px] text-zinc-500 font-medium mt-1">Real-time Telegram/WebSocket notifications and developer API access.</p>
					</div>
				</li>

				<li class="relative group cursor-default">
					<div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-300/20"></div>
					<div class="p-3.5 rounded-xl border border-white/50 bg-white/40 shadow-sm transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:bg-white/60">
						<div class="flex justify-between items-start mb-1">
							<h3 class="text-sm font-bold text-zinc-800 leading-tight">V4: One-Click Execution</h3>
							<span class="text-[9px] font-bold text-zinc-500 uppercase bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">Vision</span>
						</div>
						<p class="text-[11px] text-zinc-500 font-medium mt-1">Automated trade execution across multiple exchanges directly from the terminal.</p>
					</div>
				</li>
			</ul>

			<div class="mt-6 pt-5 border-t border-indigo-200/60 relative z-10">
				<p class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3 text-center">Missing a specific exchange?</p>
				<a href="mailto:your-email@example.com?subject=P2P Companion Feature Request" class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/10 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20 text-indigo-700 px-4 py-3 text-sm font-bold transition-all duration-300 active:scale-95 group">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-y-0.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
					Request a Feature / Contact Dev
				</a>
			</div>
		</div>

	</div>
</main>

<style>
	@keyframes sweep {
		0% { transform: translateX(-100%) skewX(-15deg); }
		25% { transform: translateX(200%) skewX(-15deg); }
		100% { transform: translateX(200%) skewX(-15deg); }
	}
</style>
