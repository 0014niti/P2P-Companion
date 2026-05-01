<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown } from 'lucide-svelte';
	
	let deferredPrompt: any = null;
	let showInstallButton = false;

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
			answer: 'We currently aggregate data from Binance, OKX, and Bybit. Our engine covers over 50 fiat currencies, including USD, EUR, GBP, RUB, GN, TRY, ARS, PHP, VND, INR, RUB,and more, allowing for global market analysis.'
		}
	];
</script>

<svelte:head>
	<title>P2P Terminal by P2P Companion | Live Crypto Price Comparison & USDT Spreads</title>
	<meta name="description" content="A 100% free, unbiased P2P comparison tool by P2P Companion. Experience premium data analytics while comparing real-time USDT rates across Binance, OKX, and Bybit." />
	
	<meta name="keywords" content="compare P2P crypto prices, best USDT P2P rate, Binance vs OKX spread, live P2P fiat calculator, USDT comparison NGN TRY ARS PHP" />
	
	{@html `<script type="application/ld+json">
		{
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
		}
	</script>`}

	{@html `<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": ${JSON.stringify(
				faqs.map(faq => ({
					"@type": "Question",
					"name": faq.question,
					"acceptedAnswer": {
						"@type": "Answer",
						"text": faq.answer
					}
				}))
			)}
		}
	</script>`}
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
	<div class="absolute -top-[10%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-300/20 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[15%] h-[60%] w-[50%] rounded-full bg-indigo-300/20 blur-[120px]"></div>
	<div class="absolute -bottom-[10%] left-[20%] h-[60%] w-[60%] rounded-full bg-sky-200/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<!-- Floating Bottom CTA Dock -->
<div class="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center p-2 rounded-full bg-white/20 backdrop-blur-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300">
	<a href="/terminal" class="group relative flex items-center gap-3 px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base font-black text-blue-700 transition-all duration-500 hover:scale-[1.02] active:scale-95 overflow-hidden">
		<span class="absolute inset-0 -translate-x-full animate-[sweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
		<span class="relative flex h-2 w-2 shrink-0">
		  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
		  <span class="relative inline-flex rounded-full h-full w-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
		</span>
		<span class="relative z-10 tracking-wide drop-shadow-sm whitespace-nowrap">Open Terminal</span>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 transition-transform group-hover:translate-x-1 text-blue-600"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
	</a>
</div>

<main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-8 pb-32">
	
	<div class="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
		
		<div class="md:col-span-8 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-8 lg:p-10 shadow-xl shadow-slate-200/30 flex flex-col justify-center relative overflow-hidden group">
			<div class="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
				<svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" class="text-blue-600"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
			</div>
			<span class="inline-flex items-center gap-1.5 w-fit rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4">
				<span class="relative flex h-1.5 w-1.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span></span>
				Live Market Data
			</span>
			<h1 class="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tighter text-zinc-950 leading-[1.05] mb-4 animate-fade-in-up">
				Compare Every <br/>
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 animate-gradient-text">Crypto Price Spread.</span>
			</h1>
			<p class="text-zinc-700 text-base sm:text-lg font-medium max-w-lg">
				Instantly compare real-time USDT order books across top global exchanges. Find the best P2P rates and uncover fiat inefficiencies with realtime and unbiased data.
			</p>
		</div>

		<div class="md:col-span-4 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-4 shadow-xl shadow-slate-200/30 flex flex-col items-center justify-center min-h-[250px] relative">
			<span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-zinc-400">Sponsored</span>
			<div class="w-full h-full rounded-2xl bg-white/50 border border-zinc-100 flex items-center justify-center overflow-hidden">
				<ins class="adsbygoogle"
					style="display:block; text-align:center; width:100%; height:100%;"
					data-ad-layout="in-article"
					data-ad-format="fluid"
					data-ad-client="ca-pub-5684719528000331"
					data-ad-slot="9284297997"></ins>
			</div>
		</div>

        <div class="lg:col-span-12 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-6 lg:p-8 shadow-xl shadow-slate-200/30">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 text-center sm:text-left">
                <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">Supported Exchanges</h2>
                <p class="text-zinc-500 text-sm font-medium">Aggregating live order books globally.</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div class="rounded-2xl bg-white/60 border border-zinc-200/60 p-3 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-white transition-all hover:-translate-y-0.5">
                    <div class="size-10 rounded-full bg-[#FCD535] flex items-center justify-center shadow-sm"><span class="text-black font-black text-[9px] tracking-widest">BNB</span></div>
                    <div><h3 class="text-[13px] font-black text-zinc-900">Binance</h3><p class="text-[10px] text-zinc-500 mt-0.5 leading-tight">Deep liquidity</p></div>
                </div>
                <div class="rounded-2xl bg-white/60 border border-zinc-200/60 p-3 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-white transition-all hover:-translate-y-0.5">
                    <div class="size-10 rounded-full bg-black flex items-center justify-center shadow-sm"><span class="text-white font-black text-[9px] tracking-widest">OKX</span></div>
                    <div><h3 class="text-[13px] font-black text-zinc-900">OKX</h3><p class="text-[10px] text-zinc-500 mt-0.5 leading-tight">Tight spreads</p></div>
                </div>
                <div class="rounded-2xl bg-white/60 border border-zinc-200/60 p-3 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-white transition-all hover:-translate-y-0.5">
                    <div class="size-10 rounded-full bg-[#FFB11A] flex items-center justify-center shadow-sm"><span class="text-black font-black text-[9px] tracking-widest">BYB</span></div>
                    <div><h3 class="text-[13px] font-black text-zinc-900">Bybit</h3><p class="text-[10px] text-zinc-500 mt-0.5 leading-tight">Zero fees</p></div>
                </div>
                <div class="rounded-2xl bg-white/60 border border-zinc-200/60 p-3 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-white transition-all hover:-translate-y-0.5">
                    <div class="size-10 rounded-full bg-[#23AF91] flex items-center justify-center shadow-sm"><span class="text-white font-black text-[9px] tracking-widest">KUC</span></div>
                    <div><h3 class="text-[13px] font-black text-zinc-900">KuCoin</h3><p class="text-[10px] text-zinc-500 mt-0.5 leading-tight">Altcoin focus</p></div>
                </div>
                <div class="rounded-2xl bg-white/60 border border-zinc-200/60 p-3 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-white transition-all hover:-translate-y-0.5">
                    <div class="size-10 rounded-full bg-[#1066FF] flex items-center justify-center shadow-sm"><span class="text-white font-black text-[9px] tracking-widest">MXC</span></div>
                    <div><h3 class="text-[13px] font-black text-zinc-900">MEXC</h3><p class="text-[10px] text-zinc-500 mt-0.5 leading-tight">Local pairs</p></div>
                </div>
                <div class="rounded-2xl bg-white/60 border border-zinc-200/60 p-3 flex flex-col items-center text-center gap-2 shadow-sm hover:bg-white transition-all hover:-translate-y-0.5">
                    <div class="size-10 rounded-full bg-[#00D2A7] flex items-center justify-center shadow-sm"><span class="text-black font-black text-[9px] tracking-widest">BGB</span></div>
                    <div><h3 class="text-[13px] font-black text-zinc-900">Bitget</h3><p class="text-[10px] text-zinc-500 mt-0.5 leading-tight">High volume</p></div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-7 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-6 lg:p-8 shadow-xl shadow-slate-200/30 flex flex-col justify-center">
            <h2 class="text-2xl font-black tracking-tight text-zinc-950 mb-6">Terminal Advantages</h2>
            <div class="flex flex-col gap-6">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-blue-100/80 border border-blue-200/60 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.37 3.63a2.12 2.12 0 1 1 3 3L12 16l-4 1 1-4Z"/></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-zinc-900 text-sm">Unbiased Aggregation</h3>
                        <p class="text-[13px] text-zinc-600 leading-relaxed mt-0.5">Live and Raw order book data directly fetched from top exchanges without manipulation.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-blue-100/80 border border-blue-200/60 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M21.29 20.66 16 22l-1.3-1.3a4.24 4.24 0 0 1 0-6l2.6-2.6a4.24 4.24 0 0 1 6 0l.01.01Z"/></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-zinc-900 text-sm">Real-Time Rates</h3>
                        <p class="text-[13px] text-zinc-600 leading-relaxed mt-0.5">Our engine fetches live P2P prices, ensuring actionable and current spreads.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-blue-100/80 border border-blue-200/60 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-zinc-900 text-sm">100% Free & Anonymous</h3>
                        <p class="text-[13px] text-zinc-600 leading-relaxed mt-0.5">No accounts, no tracking. Access institutional data with zero cost.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-5 rounded-[32px] border border-indigo-100/50 bg-indigo-50/30 backdrop-blur-2xl p-6 lg:p-8 shadow-xl shadow-indigo-100/20 flex flex-col relative overflow-hidden group">
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
            <div class="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h2 class="text-xl font-black tracking-tight text-zinc-950">Terminal Roadmap</h2>
                    <p class="text-[10px] font-semibold text-indigo-600/80 uppercase tracking-widest mt-1">Shape the future</p>
                </div>
            </div>
            <ul class="space-y-4 flex-grow relative z-10 border-l-2 border-indigo-200/50 ml-2 pl-5">
                <li class="relative group cursor-default">
                    <div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
                    <div class="p-3 rounded-xl bg-white/70 border border-white/60 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white">
                        <h3 class="text-[13px] font-bold text-zinc-900 leading-tight">V1: P2P Aggregation</h3>
                        <p class="text-[10px] text-zinc-500 font-medium mt-1">Live market data (Current)</p>
                    </div>
                </li>
                <li class="relative group cursor-default">
                    <a href="/pro" data-sveltekit-preload-data="off" class="block">
                        <div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                        <div class="p-3 rounded-xl border border-indigo-200/60 bg-gradient-to-br from-white/80 to-indigo-50/50 shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:border-indigo-300">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="text-[13px] font-bold text-indigo-950 leading-tight">V2: Spread Analytics</h3>
                                <span class="text-[8px] font-black text-indigo-700 uppercase bg-indigo-100/80 border border-indigo-200 px-1.5 py-0.5 rounded">Next</span>
                            </div>
                            <p class="text-[10px] text-zinc-600 font-medium mt-1">Historical charts & signals.</p>
                        </div>
                    </a>
                </li>
                <li class="relative group cursor-default">
                    <div class="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-300/20"></div>
                    <div class="p-3 rounded-xl border border-white/50 bg-white/40 shadow-sm transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-white/60">
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="text-[13px] font-bold text-zinc-800 leading-tight">V3: Developer APIs</h3>
                            <span class="text-[8px] font-bold text-zinc-500 uppercase bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">Plan</span>
                        </div>
                        <p class="text-[10px] text-zinc-500 font-medium mt-1">Real-time Webhook access.</p>
                    </div>
                </li>
            </ul>
            <div class="mt-5 pt-4 border-t border-indigo-200/60 relative z-10">
                <a href="mailto:p2pcompanion@proton.me" class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/10 border border-indigo-200 hover:bg-indigo-600 hover:text-white text-indigo-700 px-4 py-2.5 text-xs font-bold transition-all duration-300 active:scale-95">
                    Request a Feature (mail me)
                </a>
            </div>
        </div>

        <article class="lg:col-span-5 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-6 lg:p-8 shadow-xl shadow-slate-200/30 flex flex-col justify-center space-y-4">
            <h2 class="text-xl font-black tracking-tight text-zinc-950">Market Intelligence</h2>
            <div class="space-y-3">
                <p class="text-zinc-700 text-[13px] leading-relaxed">
                    Cryptocurrency prices fluctuate independently. Depending on regional demand, stablecoins like USDT vary significantly across centralized exchanges such as Binance, OKX, and Bybit.
                </p>
                <p class="text-zinc-700 text-[13px] leading-relaxed">
                    Our <strong>100% free-to-use</strong> comparison terminal aggregates global order books into a sleek, unbiased interface with <strong>no login or account required</strong>. We instantly calculate optimal maker and taker rates, providing complete transparency into the P2P markets.
                </p>
            </div>
        </article>

        <div class="lg:col-span-7 rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-2xl p-6 lg:p-8 shadow-xl shadow-slate-200/30">
            <h2 class="text-2xl font-black tracking-tight text-zinc-950 mb-6">FAQ</h2>
            <div class="space-y-3">
                {#each faqs as faq}
                    <details class="group rounded-xl bg-white/50 border border-zinc-200/60 shadow-sm transition-all duration-300 open:bg-white open:shadow-md open:border-blue-200/80">
                        <summary class="flex cursor-pointer list-none items-center justify-between p-4 font-bold text-zinc-800 text-sm transition-colors group-hover:text-blue-600">
                            <span>{faq.question}</span>
                            <div class="rounded-full bg-white p-1.5 shadow-sm border border-zinc-100 group-open:bg-blue-50 group-open:text-blue-600 transition-all">
                                <ChevronDown class="size-4 transition-transform duration-300 group-open:rotate-180" />
                            </div>
                        </summary>
                        <div class="p-4 pt-0 text-[13px] text-zinc-600 leading-relaxed">
                            {faq.answer}
                        </div>
                    </details>
                {/each}
            </div>
        </div>

	</div>

	<section class="mt-12 text-center opacity-60">
		<p class="text-xs text-zinc-500 font-medium">
			Global Data Coverage: Instantly compare P2P rates for NGN (Naira), TRY (Lira), ARS (Peso), PHP (Peso), VND (Dong), INR (Rupee), RUB (Ruble), USD (US Dollar), EUR (Euro), GBP (Pound Sterling),	and 50+ regional fiat currencies.
		</p>
	</section>

	{#if showInstallButton}
		<button 
			on:click={installPWA} 
			class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-2xl border border-white/50 px-5 py-3 text-sm font-bold text-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all hover:bg-white/50 hover:scale-105 active:scale-95 duration-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
			Install App
		</button>
	{/if}

</main>

<style>
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
</style>
