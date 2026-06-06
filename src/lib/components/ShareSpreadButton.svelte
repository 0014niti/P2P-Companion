<script lang="ts">
	let { 
		crypto = 'USDT', 
		fiat = 'NGN', 
		premium = '0.00', 
		buyEx = 'Binance', 
		sellEx = 'OKX' 
	} = $props();

	let copied = $state(false);

	async function shareSpread() {
		const url = new URL(window.location.origin + '/terminal');
		url.searchParams.set('fiat', fiat);
		url.searchParams.set('crypto', crypto);
		url.searchParams.set('premium', premium);
		url.searchParams.set('buy', buyEx);
		url.searchParams.set('sell', sellEx);

		const text = `🚨 I just found a ${premium}% risk-free arbitrage spread on ${crypto}/${fiat} using P2P Terminal!\n\n🛒 Buy on: ${buyEx}\n💰 Sell on: ${sellEx}\n\n📈 Verify here: ${url.toString()}`;

		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard', err);
		}
	}
</script>

<button 
	onclick={shareSpread}
	class="flex items-center justify-center gap-1.5 px-3 py-2 h-full bg-blue-50/50 hover:bg-blue-100 border border-blue-200/60 dark:bg-blue-900/20 dark:border-blue-800/50 dark:hover:bg-blue-900/40 text-[11px] font-bold text-blue-700 dark:text-blue-400 rounded-lg transition-all shadow-sm active:scale-95"
	aria-label="Share this spread"
	title="Copy Spread Alert"
>
	{#if copied}
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
		Copied
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="18" cy="5" r="3"></circle>
			<circle cx="6" cy="12" r="3"></circle>
			<circle cx="18" cy="19" r="3"></circle>
			<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
			<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
		</svg>
		Share
	{/if}
</button>