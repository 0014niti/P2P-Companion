<script lang="ts">
	import { nostrStore } from '$lib/nostrStore.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { fly, fade } from 'svelte/transition';
	import { X, Send, ShieldAlert, User, Tags, Info } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';

	let { isOpen = $bindable(false) } = $props();
	
	// Structured Form State
	let tradeType = $state('WTS');
	let tradeCoin = $state('USDT');
	let tradePrice = $state('');
	let tradeNote = $state('');

	// Login State
	let showLoginPopup = $state(false);
	let loginNameInput = $state('');

	const currentFiat = $derived(filterState.current.fiat || 'USDT');

	$effect(() => {
		if (isOpen && currentFiat) {
			nostrStore.subscribeToChannel(currentFiat);
		}
	});

	async function handleStructuredSend() {
		if (!tradePrice || !tradeNote.trim()) return;
		
		// This exact format is required for the parser below to catch it!
		const content = `[${tradeType}] ${tradeCoin} for ${currentFiat} @ ${tradePrice}\n📝 Note: ${tradeNote.slice(0, 100)}`;
		await nostrStore.sendMessage(content, currentFiat);
		
		tradePrice = '';
		tradeNote = '';
	}

	function saveUsername() {
		if (loginNameInput.trim().length > 1) {
			nostrStore.setUsername(loginNameInput.trim());
			showLoginPopup = false;
		}
	}

	function formatTime(timestamp: number) {
		return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	// 🌟 NEW: The Parser. Turns raw text back into structured data for the UI
	function parseOffer(content: string) {
		const match = content.match(/\[(WTS|WTB)\] (.*?) for (.*?) @ (.*?)(?:\n📝 Note: (.*))?/);
		if (match) {
			return {
				isOffer: true,
				type: match[1], // WTS or WTB
				coin: match[2],
				fiat: match[3],
				price: match[4],
				note: match[5] || ''
			};
		}
		return { isOffer: false, text: content };
	}

	// 🌟 NEW: Fast Avatar Generator. Turns a username into a unique color!
	function generateAvatarColor(username: string) {
		let hash = 0;
		for (let i = 0; i < username.length; i++) {
			hash = username.charCodeAt(i) + ((hash << 5) - hash);
		}
		return `hsl(${Math.abs(hash) % 360}, 75%, 65%)`; // Bright, pastel colors
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-zinc-900/30 backdrop-blur-sm z-[100]" transition:fade={{ duration: 200 }} onclick={() => isOpen = false} aria-hidden="true"></div>

	<div class="fixed inset-y-0 right-0 w-full md:w-[460px] bg-white/90 backdrop-blur-3xl border-l border-white/60 shadow-[-10px_0_50px_rgba(0,0,0,0.1)] z-[101] flex flex-col" transition:fly={{ x: '100%', duration: 400, easing: cubicOut }}>
		
		<div class="p-5 border-b border-zinc-200/50 bg-white/40 backdrop-blur-xl flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-inner shadow-blue-900/20">
					<span class="font-black text-white text-sm">{currentFiat}</span>
				</div>
				<div>
					<h2 class="text-lg font-black tracking-tight text-zinc-900 leading-tight">Local OTC Board</h2>
					<p class="text-[11px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-wider">
						<span class="relative flex h-2 w-2">
						  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
						  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
						</span>
						Live Order Book
					</p>
				</div>
			</div>
			
			<div class="flex items-center gap-2">
				{#if !nostrStore.username}
					<button onclick={() => showLoginPopup = true} class="text-[10px] font-bold bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-all shadow-sm active:scale-95">
						Set Username
					</button>
				{:else}
					<button onclick={() => showLoginPopup = true} class="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-1.5 hover:bg-zinc-200 transition-colors">
						<div class="w-3 h-3 rounded-full shadow-inner" style="background: {generateAvatarColor(nostrStore.username)}"></div>
						{nostrStore.username}
					</button>
				{/if}
				<button class="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors" onclick={() => isOpen = false}><X class="size-5" /></button>
			</div>
		</div>

		<div class="bg-rose-50/80 border-b border-rose-100 p-3 px-5 flex gap-3 shrink-0">
			<ShieldAlert class="size-5 text-rose-500 shrink-0 mt-0.5" />
			<p class="text-[10px] text-rose-700 font-medium leading-relaxed">
				<strong class="font-black uppercase tracking-wider block mb-0.5">Neutral Protocol</strong>
				Unmoderated. No escrow provided. Never send funds first. Beware of scams.
			</p>
		</div>

		<div class="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar flex flex-col-reverse bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-zinc-100/50 to-zinc-50">
			{#if nostrStore.messages.length === 0}
				<div class="h-full flex flex-col items-center justify-center text-zinc-400 gap-3 opacity-60">
					<div class="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
						<Tags class="size-8 text-zinc-300" />
					</div>
					<p class="text-xs font-bold uppercase tracking-widest text-center">No offers found for {currentFiat}<br/>Be the first to post!</p>
				</div>
			{/if}

			{#each nostrStore.messages as msg (msg.id)}
				{@const isMine = msg.username === nostrStore.username}
				{@const offer = parseOffer(msg.content)}
				
				<div class="flex flex-col {isMine ? 'items-end' : 'items-start'} group w-full">
					
					{#if offer.isOffer}
						<div class="relative w-[90%] md:w-[85%] rounded-[20px] p-4 shadow-sm border transition-all duration-300 group-hover:shadow-md
							{isMine ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm' : 'bg-white/80 backdrop-blur-xl text-zinc-900 border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-tl-sm hover:border-blue-200'}">
							
							<div class="flex justify-between items-center mb-3">
								<div class="flex items-center gap-2">
									{#if !isMine}
										<div class="w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-white" style="background: {generateAvatarColor(msg.username)}">
											{msg.username.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="text-xs font-black {isMine ? 'text-blue-100' : 'text-zinc-700'} tracking-tight">
										{isMine ? 'You' : msg.username}
									</span>
								</div>
								<span class="text-[10px] font-medium {isMine ? 'text-blue-200' : 'text-zinc-400'}">{formatTime(msg.created_at)}</span>
							</div>

							<div class="flex flex-col gap-1 mb-3">
								<div class="flex items-center gap-2">
									<span class="px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase
										{isMine ? 'bg-blue-500/50 text-white' : (offer.type === 'WTS' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}">
										{offer.type === 'WTS' ? 'SELLING' : 'BUYING'} {offer.coin}
									</span>
								</div>
								<div class="flex items-baseline gap-1.5">
									<span class="text-3xl font-black tracking-tighter {isMine ? 'text-white' : 'text-zinc-900'}">{offer.price}</span>
									<span class="text-sm font-bold {isMine ? 'text-blue-200' : 'text-zinc-500'}">{offer.fiat}</span>
								</div>
							</div>

							{#if offer.note}
								<div class="text-xs font-medium px-3 py-2 rounded-xl {isMine ? 'bg-blue-700/50 text-blue-50' : 'bg-zinc-100/80 text-zinc-600'}">
									<span class="opacity-70 mr-1">📝</span> {offer.note}
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex items-center gap-1.5 mb-1 px-1 mt-2">
							{#if !isMine}
								<div class="w-4 h-4 rounded-full" style="background: {generateAvatarColor(msg.username)}"></div>
							{/if}
							<span class="text-[10px] font-bold text-zinc-500 {isMine ? 'text-blue-500' : ''}">
								{isMine ? 'You' : msg.username}
							</span>
							<span class="text-[9px] text-zinc-400 ml-1">{formatTime(msg.created_at)}</span>
						</div>
						<div class="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm border {isMine ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm' : 'bg-white/80 backdrop-blur-xl text-zinc-900 border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-tl-sm'}">
							<p class="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
						</div>
					{/if}

				</div>
			{/each}
		</div>

		<div class="p-3 border-t border-zinc-200/60 bg-white/70 backdrop-blur-2xl shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
			<form onsubmit={(e) => { e.preventDefault(); handleStructuredSend(); }} class="flex flex-col gap-2 bg-white border border-zinc-200/80 rounded-2xl p-2 shadow-sm">
				<div class="flex gap-2">
					<select bind:value={tradeType} class="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-2 py-2 text-xs font-black tracking-wide focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-20">
						<option value="WTS">WTS</option>
						<option value="WTB">WTB</option>
					</select>
					<select bind:value={tradeCoin} class="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-2 py-2 text-xs font-black tracking-wide focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-20">
						<option value="USDT">USDT</option>
						<option value="BTC">BTC</option>
						<option value="ETH">ETH</option>
					</select>
					<input type="number" step="0.01" bind:value={tradePrice} placeholder="Price in {currentFiat}" class="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-400 placeholder:font-medium"/>
				</div>
				<div class="flex gap-2">
					<input type="text" bind:value={tradeNote} maxlength="100" placeholder="Add terms (e.g. IMPS only, fast release)..." class="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-400"/>
					<button type="submit" disabled={!tradePrice || !tradeNote.trim()} class="bg-blue-600 text-white rounded-xl px-5 py-2 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 active:scale-95">
						<Send class="size-4" />
					</button>
				</div>
			</form>
		</div>

		{#if showLoginPopup}
			<div class="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6" transition:fade={{duration: 150}}>
				<div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-6 w-full max-w-sm" transition:fly={{y: 20}}>
					<h3 class="text-xl font-black text-zinc-900 mb-1">Set Display Name</h3>
					<p class="text-xs font-medium text-zinc-500 mb-5">Choose how you want to appear on the OTC board. No signup required.</p>
					
					<form onsubmit={(e) => { e.preventDefault(); saveUsername(); }} class="space-y-3">
						<input type="text" bind:value={loginNameInput} placeholder="e.g. Trader_IND" maxlength="15" class="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 rounded-2xl px-4 py-3.5 text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-inner"/>
						<div class="flex gap-2 pt-2">
							<button type="button" class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors" onclick={() => showLoginPopup = false}>Cancel</button>
							<button type="submit" disabled={loginNameInput.trim().length < 2} class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/20">Save Profile</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
{/if}
