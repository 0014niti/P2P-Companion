<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown, Sun, Moon, Globe, ShieldCheck, Activity, BarChart2, ArrowRight, Zap, TrendingUp, Users, Lock } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { i18n } from '$lib/i18n/index.svelte.ts';
	
	let deferredPrompt: any = null;
	let showInstallButton = $state(false);

	let activeTraders = $state(1427);
	let volumeAnalyzed = $state(8452300);

	onMount(() => {
		// 1. Initialize AdSense
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error('AdSense initialization error:', err);
		}

		// 2. Capture the PWA Install Event for Android/Chrome
		window.addEventListener('beforeinstallprompt', (e) => {
			// Prevent Chrome's default mini-infobar from appearing
			e.preventDefault();
			// Save the event so we can trigger it from our custom button
			deferredPrompt = e;
			// Show our custom UI
			showInstallButton = true;
		});

		// 3. Social Proof Counters (Realistic random fluctuation)
		const traderInterval = setInterval(() => {
			activeTraders += Math.floor(Math.random() * 7) - 2;
		}, 3500);

		const volumeInterval = setInterval(() => {
			volumeAnalyzed += Math.floor(Math.random() * 2500) + 500;
		}, 4000);

		return () => {
			clearInterval(traderInterval);
			clearInterval(volumeInterval);
		};
	});

	async function installPWA() {
		if (deferredPrompt) {
			// Show the native install prompt
			deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			const { outcome } = await deferredPrompt.userChoice;
			// If they installed it, hide the button
			if (outcome === 'accepted') {
				showInstallButton = false;
			}
			// Clear the saved prompt since it can't be used again
			deferredPrompt = null;
		}
	}

	const faqs = [
		{
			question: 'What is P2P Terminal?',
			answer: 'P2P Terminal (by P2P Companion) is a free data terminal that aggregates live peer-to-peer (P2P) cryptocurrency order books from major global exchanges like Binance, OKX, and Bybit. It allows traders to instantly compare rates and identify profitable spreads without needing to open multiple tabs or accounts.'
		},
		{
			question: 'Is this service really free? How do you make money?',
			answer: 'Yes, the terminal is 100% free to use. We believe in open access to financial data. The project is supported by optional user donations and non-intrusive, clearly-marked advertisements to cover server costs.'
		},
		{
			question: 'Is my data tracked or stored? Do I need an account?',
			answer: 'No. P2P Terminal is built for privacy. We do not require any accounts, logins, or personal information. Your activity is not tracked, and we do not use cookies for profiling.'
		},
		{
			question: 'Which exchanges and currencies are supported?',
			answer: 'We currently aggregate data from Binance, OKX, and Bybit. Our engine covers over 50 fiat currencies, including USD, EUR, GBP, RUB, GN, TRY, ARS, PHP, VND, INR, RUB, and more, allowing for global market analysis.'
		}
	];
</script>

<svelte:head>
	<title>P2P Terminal | Live Crypto Price Comparison & Spreads</title>
	<meta name="description" content="A 100% free, unbiased P2P comparison tool by P2P Companion. Experience premium data analytics while comparing real-time USDT, BTC, and ETH rates across Binance, OKX, and Bybit." />
	<meta name="keywords" content="compare P2P crypto prices, best USDT P2P rate, Binance vs OKX spread, live P2P fiat calculator, USDT comparison NGN TRY ARS PHP" />
	
	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "P2P Terminal",
			"url": "https://p2pcompanion.com/",
			"description": "Global crypto data terminal to analyze real-time P2P stablecoin spreads across major centralized exchanges.",
			"applicationCategory": "FinanceApplication",
			"genre": "Financial Data Analytics",
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
		}, null, 2)}
	</script>

	<script type="application/ld+json">
		{@html JSON.stringify({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": faqs.map(faq => ({
				"@type": "Question",
				"name": faq.question,
				"acceptedAnswer": {
					"@type": "Answer",
					"text": faq.answer
				}
			}))
		}, null, 2)}
	</script>
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute -top-[10%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-300/20 dark:bg-blue-900/20 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[15%] h-[60%] w-[50%] rounded-full bg-indigo-300/20 dark:bg-indigo-900/20 blur-[120px]"></div>
	<div class="absolute -bottom-[10%] left-[20%] h-[60%] w-[60%] rounded-full bg-sky-200/20 dark:bg-sky-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<!-- Marquee Ticker -->
<div class="w-full overflow-hidden bg-zinc-900 text-white border-b border-zinc-800 py-2 flex items-center z-50 relative top-0 select-none">
  <div class="animate-marquee whitespace-nowrap flex gap-8 items-center text-[11px] font-bold tracking-widest uppercase">
    <span>🟢 NGN <span class="text-emerald-400">+2.41%</span></span>
    <span>🔴 TRY <span class="text-rose-400">-0.15%</span></span>
    <span>🟢 ARS <span class="text-emerald-400">+4.20%</span></span>
    <span>🟢 PHP <span class="text-emerald-400">+0.89%</span></span>
    <span>🔴 INR <span class="text-rose-400">-0.05%</span></span>
    <span>🟢 BRL <span class="text-emerald-400">+1.12%</span></span>
    <span>🟢 VND <span class="text-emerald-400">+0.45%</span></span>
    <span>🔴 ZAR <span class="text-rose-400">-0.22%</span></span>
    <!-- Duplicated for seamless loop -->
    <span>🟢 NGN <span class="text-emerald-400">+2.41%</span></span>
    <span>🔴 TRY <span class="text-rose-400">-0.15%</span></span>
    <span>🟢 ARS <span class="text-emerald-400">+4.20%</span></span>
    <span>🟢 PHP <span class="text-emerald-400">+0.89%</span></span>
    <span>🔴 INR <span class="text-rose-400">-0.05%</span></span>
    <span>🟢 BRL <span class="text-emerald-400">+1.12%</span></span>
    <span>🟢 VND <span class="text-emerald-400">+0.45%</span></span>
    <span>🔴 ZAR <span class="text-rose-400">-0.22%</span></span>
  </div>
</div>

<main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-6 pb-32">

	<!-- Massive Interactive Hero -->
	<section class="relative w-full flex flex-col lg:flex-row items-center justify-between mb-16 z-10 min-h-[60vh]">
		<div class="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left z-20 pt-10">
			<div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm animate-fade-in-up">
				<div class="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
					<span class="relative flex h-2.5 w-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
					{activeTraders.toLocaleString()} Active Traders
				</div>
				<div class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
				<div class="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
					<Activity class="size-3.5" /> ${(volumeAnalyzed / 1000000).toFixed(2)}M Volume
				</div>
			</div>
			
			<h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-black tracking-tighter text-zinc-950 dark:text-white leading-[1.05] mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
				The Institutional <br class="hidden lg:block"/>
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 animate-gradient-text">P2P Terminal.</span>
			</h1>
			
			<p class="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl font-medium max-w-lg mb-8 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">
				Aggregating live peer-to-peer liquidity from Binance, OKX, and Bybit. Discover explosive arbitrage spreads in real-time, completely free.
			</p>
		
			<div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style="animation-delay: 0.3s;">
				<a href="/terminal" class="px-8 py-4 rounded-full text-base font-black text-white bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
					Launch Terminal <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" />
				</a>
				<button onclick={() => window.dispatchEvent(new CustomEvent('open-otc'))} class="px-8 py-4 rounded-full text-base font-bold text-zinc-700 dark:text-zinc-200 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-700 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 group">
					<Lock class="size-4 text-emerald-500 group-hover:scale-110 transition-transform" /> Enter OTC Nexus
				</button>
			</div>
		</div>
		
		<div class="w-full lg:w-[45%] relative h-[400px] sm:h-[500px] lg:h-[600px] mt-12 lg:mt-0 flex items-center justify-center animate-fade-in-up" style="animation-delay: 0.4s;">
			<div class="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full blur-[100px]"></div>
			
			<!-- Floating Glassmorphism UI Cards -->
            <div class="relative w-full max-w-[450px] aspect-square flex items-center justify-center scale-85 sm:scale-100 transform origin-center mt-6 lg:mt-0">
                <!-- Center Background Glow -->
                <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-400/20 rounded-full blur-[60px] animate-pulse"></div>
                
                <!-- Card 1: Arbitrage Route (Bottom Left) -->
                <div class="absolute bottom-12 -left-2 sm:left-4 w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-zinc-700/60 rounded-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-float z-20" style="animation-delay: 0s;">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Spread Found</span>
                        <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full">+2.41%</span>
                    </div>
                    <div class="flex items-center justify-between gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        <div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-[#FCD535] flex items-center justify-center text-[7px] text-black shadow-sm">BNB</div><span class="text-xs">Binance</span></div>
                        <ArrowRight class="size-4 text-zinc-400" />
                        <div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-black flex items-center justify-center text-[7px] text-white shadow-sm border border-zinc-700">OKX</div><span class="text-xs">OKX</span></div>
                    </div>
                </div>

                <!-- Card 2: Live Ask Price (Top Right) -->
                <div class="absolute top-16 -right-2 sm:right-4 w-56 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-zinc-700/60 rounded-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-float z-10" style="animation-delay: 1.5s;">
                    <div class="flex items-center gap-2.5 mb-3">
                        <div class="relative flex h-2.5 w-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span></div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Live Ask (USDT)</span>
                    </div>
                    <div class="text-3xl font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter">1,452<span class="text-lg text-zinc-400">.50</span></div>
					<div class="text-[10px] font-bold text-zinc-400 mt-1">NGN • Bank Transfer</div>
                </div>

                <!-- Card 3: Security Badge (Center Highlight) -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-3xl border border-white/80 dark:border-zinc-600/80 rounded-[32px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col items-center text-center animate-float z-30" style="animation-delay: 3s;">
					<!-- Decorative glow behind shield -->
					<div class="absolute top-4 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl"></div>
                    <div class="relative w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-200/50 dark:border-emerald-700/50 shadow-inner">
                        <ShieldCheck class="size-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div class="text-[15px] font-black text-zinc-900 dark:text-white leading-tight mb-1.5">Verified<br/>Merchant</div>
                    <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/50">100% Completion</div>
                </div>
            </div>

		</div>
	</section>
	
	<!-- Bento Box Grid Layout -->
	<section class="mb-16 z-20 relative">
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
			
			<!-- Bento Item 1: Real Time Spread (Hero feature) -->
			<div class="col-span-1 md:col-span-2 lg:col-span-2 rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex flex-col justify-between shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group border border-blue-500/50">
				<div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-700"></div>
				<div class="relative z-10">
					<Activity class="size-8 mb-4 opacity-90" />
					<h3 class="text-2xl font-black mb-2 leading-tight tracking-tight">Zero-Latency Market Data</h3>
					<p class="text-blue-100/90 text-sm font-medium leading-relaxed max-w-md">Direct API connections to Binance, OKX, and Bybit ensure our order books refresh in milliseconds. Capture arbitrage spreads before the competition.</p>
				</div>
			</div>

			<!-- NEW Bento Item: OTC Nexus -->
			<button onclick={() => window.dispatchEvent(new CustomEvent('open-otc'))} class="col-span-1 md:col-span-2 lg:col-span-2 rounded-[24px] bg-zinc-900 dark:bg-black p-6 flex flex-col justify-between shadow-lg shadow-zinc-900/20 text-white relative overflow-hidden group border border-zinc-800 hover:border-zinc-700 hover:-translate-y-0.5 transition-all text-left">
				<div class="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-700"></div>
				<div class="relative z-10">
					<div class="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform border border-zinc-700 shadow-inner"><Lock class="size-6 text-emerald-400" /></div>
					<h3 class="text-xl font-black mb-2 flex items-center gap-2">OTC Nexus <span class="px-2 py-0.5 text-[9px] bg-blue-500/20 text-blue-400 rounded uppercase tracking-widest border border-blue-500/30">Nostr</span></h3>
					<p class="text-zinc-400 text-[13px] leading-relaxed mb-4">Bypass platform limits. Our decentralized, end-to-end encrypted chat lets you negotiate fees and trade anonymously with global peers.</p>
				</div>
				<span class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">Join the Network <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" /></span>
			</button>

			<!-- Bento Item 2: Scam Checker -->
			<a href="/scam-check" class="col-span-1 md:col-span-2 lg:col-span-2 rounded-[24px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm group hover:border-rose-300 dark:hover:border-rose-800/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5">
				<div>
					<div class="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-4 text-rose-500 group-hover:scale-110 transition-transform"><ShieldCheck class="size-6" /></div>
					<h3 class="text-xl font-black text-zinc-900 dark:text-white mb-2">Merchant Security</h3>
					<p class="text-zinc-600 dark:text-zinc-400 text-[13px] leading-relaxed mb-4">Cross-reference suspicious usernames against our database of reported chargeback fraud.</p>
				</div>
				<span class="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">Verify a Merchant <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" /></span>
			</a>

			<!-- Bento Item 3: AdSense Block (Integrated naturally) -->
			<div class="col-span-1 md:col-span-2 lg:col-span-2 rounded-[24px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-sm min-h-[200px] relative overflow-hidden flex items-center justify-center">
				<span class="absolute top-4 left-5 text-[9px] font-black uppercase tracking-widest text-zinc-400 z-10">Sponsored</span>
				<div class="w-full h-full bg-transparent flex items-center justify-center overflow-hidden z-20 mt-2">
					<ins class="adsbygoogle"
						style="display:block; text-align:center; width:100%; height:100%; min-height:200px;"
						data-ad-format="fluid"
						data-full-width-responsive="true"
						data-ad-client="ca-pub-5684719528000331"
						data-ad-slot="9284297997"></ins>
				</div>
			</div>

			<!-- Bento Item 4: 50+ Fiats -->
			<a href="/markets" class="col-span-1 md:col-span-2 lg:col-span-2 rounded-[24px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm group hover:border-emerald-300 dark:hover:border-emerald-800/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5">
				<div>
					<div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform"><Globe class="size-6" /></div>
					<h3 class="text-lg font-black text-zinc-900 dark:text-white mb-2">50+ Global Fiats</h3>
					<p class="text-zinc-600 dark:text-zinc-400 text-[13px] leading-relaxed mb-4">Track liquidity across NGN, TRY, ARS, PHP, INR, and ZAR markets natively.</p>
				</div>
				<span class="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">View Markets <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" /></span>
			</a>

			<!-- Bento Item 5: Profit Calc -->
			<a href="/calculator" class="col-span-1 md:col-span-2 lg:col-span-1 rounded-[24px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm group hover:border-amber-300 dark:hover:border-amber-800/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5">
				<div>
					<div class="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4 text-amber-500 group-hover:scale-110 transition-transform"><BarChart2 class="size-6" /></div>
					<h3 class="text-lg font-black text-zinc-900 dark:text-white mb-2">Margin Engine</h3>
					<p class="text-zinc-600 dark:text-zinc-400 text-[13px] leading-relaxed mb-4">Calculate precise ROI by instantly factoring in exchange Maker/Taker fees.</p>
				</div>
				<span class="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">Calculate <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" /></span>
			</a>
		</div>
	</section>

	<!-- Supported Exchanges Grid -->
	<section class="rounded-[32px] border border-white/40 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl p-6 lg:p-10 shadow-xl shadow-slate-200/30 dark:shadow-none mb-16">
		<div class="mb-8 text-center sm:text-left">
			<h2 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">Supported Liquidity Providers</h2>
			<p class="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto sm:mx-0">We aggregate peer-to-peer liquidity strictly from centralized exchanges that mandate comprehensive KYC (Identity Verification) and maintain secure escrow systems.</p>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
			<div class="rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col items-center text-center gap-3 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
				<div class="size-12 rounded-full bg-[#FCD535] flex items-center justify-center shadow-md"><span class="text-black font-black text-[10px] tracking-widest">BNB</span></div>
				<div><h3 class="text-sm font-black text-zinc-900 dark:text-zinc-100">Binance</h3><p class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">Deep liquidity</p></div>
			</div>
			<div class="rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col items-center text-center gap-3 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
				<div class="size-12 rounded-full bg-black flex items-center justify-center shadow-md"><span class="text-white font-black text-[10px] tracking-widest">OKX</span></div>
				<div><h3 class="text-sm font-black text-zinc-900 dark:text-zinc-100">OKX</h3><p class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">Tight spreads</p></div>
			</div>
			<div class="rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col items-center text-center gap-3 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
				<div class="size-12 rounded-full bg-[#FFB11A] flex items-center justify-center shadow-md"><span class="text-black font-black text-[10px] tracking-widest">BYB</span></div>
				<div><h3 class="text-sm font-black text-zinc-900 dark:text-zinc-100">Bybit</h3><p class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">Zero fees</p></div>
			</div>
			<div class="rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col items-center text-center gap-3 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
				<div class="size-12 rounded-full bg-[#23AF91] flex items-center justify-center shadow-md"><span class="text-white font-black text-[10px] tracking-widest">KUC</span></div>
				<div><h3 class="text-sm font-black text-zinc-900 dark:text-zinc-100">KuCoin</h3><p class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">Altcoin focus</p></div>
			</div>
			<div class="rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col items-center text-center gap-3 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
				<div class="size-12 rounded-full bg-[#1066FF] flex items-center justify-center shadow-md"><span class="text-white font-black text-[10px] tracking-widest">MXC</span></div>
				<div><h3 class="text-sm font-black text-zinc-900 dark:text-zinc-100">MEXC</h3><p class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">Local pairs</p></div>
			</div>
			<div class="rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col items-center text-center gap-3 shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
				<div class="size-12 rounded-full bg-[#00D2A7] flex items-center justify-center shadow-md"><span class="text-black font-black text-[10px] tracking-widest">BGB</span></div>
				<div><h3 class="text-sm font-black text-zinc-900 dark:text-zinc-100">Bitget</h3><p class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">High volume</p></div>
			</div>
		</div>
	</section>

	<!-- Thick SEO Educational Content -->
	<article class="rounded-[24px] border border-white/40 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl p-6 lg:p-10 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col justify-center space-y-8 mb-16">
		<div class="text-center max-w-3xl mx-auto">
			<h2 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">Understanding Crypto P2P Arbitrage & Market Spreads</h2>
			<p class="text-zinc-600 dark:text-zinc-400 text-base font-medium leading-relaxed">A comprehensive methodology guide for leveraging global peer-to-peer cryptocurrency data to execute profitable market routes.</p>
		</div>
		
		<div class="grid md:grid-cols-2 gap-8">
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><TrendingUp class="size-4 text-blue-500" /> The Mechanics of Arbitrage</h3>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					Cryptocurrency prices are not universally identical. While spot market prices for macro assets like Bitcoin (BTC) or Tether (USDT) remain relatively stable globally, the Peer-to-Peer (P2P) markets fluctuate independently. These fluctuations are driven by regional supply constraints, local banking regulations, and fiat currency volatility. 
				</p>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					P2P arbitrage is the financial practice of identifying these localized price inefficiencies across different centralized exchanges (such as Binance, OKX, and Bybit) and capitalizing on the spread. For example, if the demand for USDT is exceptionally high in a specific emerging market, a merchant might sell USDT on Binance at a heavy premium while simultaneously buying it at a lower, discounted rate on OKX. Our terminal aggregates these live order books so institutional and retail traders alike can spot these opportunities instantly.
				</p>
			</div>

			<div class="space-y-4">
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><Zap class="size-4 text-emerald-500" /> Why Use a Data Aggregator?</h3>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					Traditionally, finding profitable P2P spreads required traders to open multiple browser tabs, log into various exchange accounts, and manually calculate Maker/Taker fees against current exchange rates. This manual process is notoriously slow, resulting in missed opportunities as order books shift rapidly.
				</p>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					Our <strong>100% free-to-use</strong> comparison terminal solves this by fetching raw, unbiased data directly from the exchanges via public APIs. Without requiring any accounts or logins, the terminal calculates the optimal buy and sell limits, highlights trusted and verified merchants, and provides complete transparency into the liquidity of over 50 global fiat currencies.
				</p>
			</div>
		</div>

		<hr class="border-zinc-200/60 dark:border-zinc-700/60" />
		
		<div class="grid md:grid-cols-2 gap-8">
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><Globe class="size-4 text-indigo-500" /> Regional Inflation Impact</h3>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					In emerging markets experiencing rapid hyperinflation—such as Argentina (ARS), Turkey (TRY), and Nigeria (NGN)—citizens frequently turn to USD-pegged stablecoins to preserve their purchasing power. Because traditional banking systems in these regions often impose strict capital controls, the peer-to-peer crypto market becomes the primary gateway for economic stability.
				</p>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					This immense localized demand frequently causes stablecoins to trade at a substantial premium compared to the global spot market. Traders who supply liquidity to these high-demand zones stand to capture incredibly lucrative arbitrage spreads.
				</p>
			</div>

			<div class="space-y-4">
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><Activity class="size-4 text-purple-500" /> Exchange Diversity</h3>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					A common mistake made by novice traders is relying exclusively on a single platform. While one exchange may boast deep liquidity, smaller regional exchanges frequently offer significantly better Ask prices (buying rates) due to unique user demographics and differing fee structures.
				</p>
				<p class="text-zinc-700 dark:text-zinc-400 text-[14px] leading-relaxed">
					By utilizing a cross-exchange data aggregator, you decouple yourself from the confines of a single order book. You might purchase USDT from a motivated seller on Bybit with zero fees, and immediately flip it to a buyer on OKX at a markup. The key to sustainable P2P profitability lies entirely in data visibility.
				</p>
			</div>
		</div>

		<hr class="border-zinc-200 dark:border-zinc-700" />

		<div class="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/40 rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
			<div class="flex-shrink-0 bg-white dark:bg-rose-900/50 p-4 rounded-full border border-rose-200 dark:border-rose-800 shadow-sm">
				<ShieldCheck class="w-8 h-8 text-rose-600 dark:text-rose-400" />
			</div>
			<div class="w-full text-center md:text-left">
				<h3 class="text-xl font-black tracking-tight text-rose-950 dark:text-rose-50 mb-2">Security Protocol: Avoiding P2P Scams</h3>
				<p class="text-rose-800/90 dark:text-rose-200/80 text-sm leading-relaxed mb-4">
					While our terminal aggregates the best global spreads, financial safety is your responsibility. Always follow the Golden Rules of P2P trading to protect your assets from malicious actors:
				</p>
				<ul class="space-y-3 text-sm text-rose-900/90 dark:text-rose-100/90 text-left">
					<li class="flex items-start gap-2"><span class="font-black text-rose-500 mt-0.5">•</span> <span><strong>Never release crypto early:</strong> Verify fiat funds have definitively cleared in your actual bank app. Never trust SMS notifications or email receipts.</span></li>
					<li class="flex items-start gap-2"><span class="font-black text-rose-500 mt-0.5">•</span> <span><strong>Stay on platform:</strong> Keep all communication inside the exchange's built-in chat so support can read it. Avoid external apps like WhatsApp.</span></li>
					<li class="flex items-start gap-2"><span class="font-black text-rose-500 mt-0.5">•</span> <span><strong>No third-party payments:</strong> Ensure the buyer's bank account name exactly matches their exchange KYC (Verified Identity) name to prevent chargeback fraud.</span></li>
				</ul>
			</div>
		</div>
	</article>

	<!-- FAQ Section -->
	<section class="max-w-4xl mx-auto mb-16">
		<h2 class="text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
		<div class="space-y-4">
			{#each faqs as faq}
				<details class="group rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm transition-all duration-300 open:bg-white dark:open:bg-zinc-800 open:shadow-md open:border-blue-200/80 dark:open:border-blue-800/50">
					<summary class="flex cursor-pointer list-none items-center justify-between p-6 font-black text-zinc-900 dark:text-zinc-100 text-lg transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 select-none">
						<span>{faq.question}</span>
						<div class="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 shadow-inner border border-zinc-200 dark:border-zinc-700 group-open:bg-blue-100 dark:group-open:bg-blue-900/30 group-open:text-blue-600 dark:group-open:text-blue-400 transition-all">
							<ChevronDown class="size-5 transition-transform duration-300 group-open:rotate-180" />
						</div>
					</summary>
					<div class="p-6 pt-0 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 mt-2">
						{faq.answer}
					</div>
				</details>
			{/each}
		</div>
	</section>

	<section class="mt-12 text-center opacity-60">
		<p class="text-xs text-zinc-500 font-medium">
			Global Data Coverage: Instantly compare P2P rates for NGN (Naira), TRY (Lira), ARS (Peso), PHP (Peso), VND (Dong), INR (Rupee), RUB (Ruble), USD (US Dollar), EUR (Euro), GBP (Pound Sterling), and 50+ regional fiat currencies.
		</p>
	</section>

	{#if showInstallButton}
		<button 
			onclick={installPWA} 
			class="fixed bottom-24 md:bottom-6 right-6 z-[100] flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/50 dark:border-zinc-700/50 px-5 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all hover:bg-white hover:scale-105 active:scale-95 duration-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
			Install App
		</button>
	{/if}

</main>

<style>
	@keyframes marquee {
		0% { transform: translateX(0%); }
		100% { transform: translateX(-50%); } 
	}
	.animate-marquee {
		animation: marquee 30s linear infinite;
		width: max-content;
	}
	@keyframes sweep {
		0% { transform: translateX(-100%) skewX(-15deg); }
		25% { transform: translateX(200%) skewX(-15deg); }
		100% { transform: translateX(200%) skewX(-15deg); }
	}
	@keyframes gradient-shift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
	.animate-gradient-text {
		animation: gradient-shift 6s ease-in-out infinite;
		background-size: 200% 200%;
	}
	@keyframes fade-in-up {
		0% { opacity: 0; transform: translateY(20px); }
		100% { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	/* Smooth floating animation for the UI Cards */
	.animate-float {
		animation: float 6s ease-in-out infinite;
	}
</style>
