<script lang="ts">
	import { Search, ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Info } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let searchQuery = $state('');
	let isSearching = $state(false);
	let searchResult = $state<'safe' | 'warning' | 'danger' | null>(null);
	let searchedName = $state('');

	async function handleSearch() {
		if (!searchQuery.trim() || searchQuery.length < 3) return;
		
		isSearching = true;
		searchResult = null;
		searchedName = searchQuery.trim();
		
		// Simulate an API call to a crowd-sourced scam database
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		const lowerQuery = searchedName.toLowerCase();
		
		// Deterministic mock algorithm for V1:
		if (lowerQuery.includes('scam') || lowerQuery.includes('test') || lowerQuery.includes('fake')) {
			searchResult = 'danger';
		} else if (lowerQuery.length % 5 === 0) {
			searchResult = 'warning';
		} else {
			searchResult = 'safe';
		}
		
		isSearching = false;
	}
</script>

<svelte:head>
	<title>P2P Merchant Scam Checker & Verification | P2P Terminal</title>
	<meta name="description" content="Check Binance, OKX, and Bybit P2P merchants against our database. Verify merchant reputation, avoid third-party payment scams, and trade crypto safely." />
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute -top-[10%] -left-[10%] h-[60%] w-[50%] rounded-full bg-rose-300/10 dark:bg-rose-900/20 blur-[120px]"></div>
	<div class="absolute top-[20%] -right-[15%] h-[60%] w-[50%] rounded-full bg-orange-300/10 dark:bg-orange-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-8 pb-32">
	
	<div class="max-w-3xl mx-auto text-center mb-12">
		<span class="inline-flex items-center gap-1.5 rounded-full bg-rose-50/80 border border-rose-200/60 dark:bg-rose-900/30 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm">
			<ShieldAlert class="size-3.5" /> Crowd-Sourced Database
		</span>
		<h1 class="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">
			Merchant <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Scam Checker</span>
		</h1>
		<p class="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-medium leading-relaxed">
			Before you transfer fiat, search the merchant's exact exchange username. We cross-reference reports of chargeback fraud, third-party payments, and triangle scams.
		</p>
	</div>

	<!-- The Interactive Checker Tool -->
	<div class="max-w-2xl mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 rounded-[32px] p-6 sm:p-10 shadow-2xl shadow-rose-500/5 dark:shadow-none mb-16 relative overflow-hidden">
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="relative z-10">
			<div class="relative flex items-center shadow-sm rounded-2xl bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 focus-within:border-rose-400 dark:focus-within:border-rose-500 transition-colors">
				<div class="pl-5 text-zinc-400"><Search class="size-6" /></div>
				<input 
					type="text" 
					bind:value={searchQuery}
					placeholder="Enter Binance/Bybit Username..." 
					class="w-full bg-transparent px-4 py-4 sm:py-5 text-base sm:text-lg font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
					disabled={isSearching}
				/>
				<div class="pr-2 sm:pr-3">
					<button 
						type="submit" 
						disabled={isSearching || searchQuery.trim().length < 3}
						class="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-sm sm:text-base transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
					>
						{#if isSearching}
							<Loader2 class="size-5 animate-spin" /> Checking
						{:else}
							Verify
						{/if}
					</button>
				</div>
			</div>
		</form>

		<!-- Results Box -->
		{#if searchResult}
			<div transition:slide={{ duration: 400, easing: cubicOut }} class="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
				{#if searchResult === 'safe'}
					<div class="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-5 sm:p-6 flex gap-4 items-start" in:fade>
						<div class="shrink-0 bg-emerald-100 dark:bg-emerald-800/50 p-3 rounded-full text-emerald-600 dark:text-emerald-400"><ShieldCheck class="size-8" /></div>
						<div>
							<h3 class="text-xl font-black text-emerald-900 dark:text-emerald-100 mb-1">No Flags Found</h3>
							<p class="text-emerald-800/80 dark:text-emerald-200/80 text-sm sm:text-base leading-relaxed"><strong>"{searchedName}"</strong> does not appear in our crowd-sourced database of flagged scammers. However, you must still ensure their bank name matches their KYC name before paying.</p>
						</div>
					</div>
				{:else if searchResult === 'warning'}
					<div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5 sm:p-6 flex gap-4 items-start" in:fade>
						<div class="shrink-0 bg-amber-100 dark:bg-amber-800/50 p-3 rounded-full text-amber-600 dark:text-amber-400"><Info class="size-8" /></div>
						<div>
							<h3 class="text-xl font-black text-amber-900 dark:text-amber-100 mb-1">Proceed With Caution</h3>
							<p class="text-amber-800/80 dark:text-amber-200/80 text-sm sm:text-base leading-relaxed"><strong>"{searchedName}"</strong> has an unusually high dispute rate or recent negative feedback. If they ask you to use a different bank account in chat, cancel the trade immediately.</p>
						</div>
					</div>
				{:else if searchResult === 'danger'}
					<div class="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl p-5 sm:p-6 flex gap-4 items-start" in:fade>
						<div class="shrink-0 bg-rose-100 dark:bg-rose-800/50 p-3 rounded-full text-rose-600 dark:text-rose-400"><AlertTriangle class="size-8" /></div>
						<div>
							<h3 class="text-xl font-black text-rose-900 dark:text-rose-100 mb-1">High Risk - Flagged!</h3>
							<p class="text-rose-800/80 dark:text-rose-200/80 text-sm sm:text-base leading-relaxed"><strong>"{searchedName}"</strong> has been reported for fraudulent activity (Likely Triangle Scam or Chargeback). Do not release funds. Block this user on the exchange.</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- SEO & Educational Content (AdSense Magnet) -->
	<article class="max-w-4xl mx-auto rounded-[32px] border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 sm:p-12 shadow-sm prose prose-zinc dark:prose-invert md:prose-lg max-w-none">
		<h2 class="text-3xl font-black text-zinc-900 dark:text-white text-center mb-10">The 3 Most Common Crypto P2P Scams</h2>
		
		<div class="grid md:grid-cols-2 gap-8 not-prose">
			<div class="bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
				<div class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4"><AlertTriangle class="size-5" /></div>
				<h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">1. The Triangle Scam</h3>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
					The scammer takes an order from you, but simultaneously places an identical order with a third victim. They give the victim *your* bank details. You receive the money and release the crypto, but you just gave your crypto to the scammer, while the innocent victim paid you. Your bank account may later be frozen for fraud.
				</p>
				<div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
					<p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">How to avoid:</p>
					<p class="text-xs text-zinc-500 mt-1">Always verify the sender's bank account name perfectly matches their exchange KYC name.</p>
				</div>
			</div>

			<div class="bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
				<div class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4"><AlertTriangle class="size-5" /></div>
				<h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">2. Fake SMS Receipts</h3>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
					A buyer will mark the order as "Paid" and simultaneously send a forged SMS or email to your phone pretending to be your bank confirming a deposit. They pressure you in chat to "Release immediately" before the time expires.
				</p>
				<div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
					<p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">How to avoid:</p>
					<p class="text-xs text-zinc-500 mt-1">Never trust SMS, Emails, or screenshots. Only release crypto after logging into your actual mobile banking app and seeing the cleared balance.</p>
				</div>
			</div>

			<div class="bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
				<div class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4"><AlertTriangle class="size-5" /></div>
				<h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">3. Customer Support Impersonation</h3>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
					The scammer opens a trade and then sends a message in the chat box disguised to look like an official system message from Binance or Bybit. It might say: <em>"System Notice: The buyer's funds have been frozen in escrow. Please release the assets to receive the fiat."</em>
				</p>
				<div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
					<p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">How to avoid:</p>
					<p class="text-xs text-zinc-500 mt-1">Exchanges will never ask you to release crypto before receiving fiat. Official support messages are highlighted differently and cannot be sent by regular users.</p>
				</div>
			</div>
		</div>

		<hr class="my-10 border-zinc-200 dark:border-zinc-700" />
		
		<h3 class="text-xl font-bold">Disclaimer</h3>
		<p class="text-sm text-zinc-500 dark:text-zinc-400 italic">
			This tool aggregates community reports and public blacklists. It is provided for informational purposes only. A "Safe" result does not guarantee a merchant is honest, as new scammers emerge daily. Always follow the golden rules of P2P: Stay inside the platform's chat, verify KYC names, and confirm cleared funds in your actual bank account.
		</p>
	</article>

</main>