<script lang="ts">
	import { nostrStore } from '$lib/nostrStore.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { fade, scale } from 'svelte/transition';
	import { X, Send, ShieldAlert, User, Tags, Info, Zap } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';

	let { isOpen = $bindable(false) } = $props();
	
	let tradeType = $state('WTS');
	let tradeCoin = $state('USDT');
	let tradePrice = $state('');
	let tradeNote = $state('');

	let showLoginPopup = $state(false);
	let loginNameInput = $state('');
	
	// 🌟 NEW: Intro Modal State
	let showIntroModal = $state(false);

	const currentFiat = $derived(filterState.current.fiat || 'USDT');

	// 🌟 NEW: Check if they've seen the intro before opening
	$effect(() => {
		if (isOpen && currentFiat) {
			nostrStore.subscribeToChannel(currentFiat);
			
			if (typeof window !== 'undefined') {
				const hasSeenIntro = localStorage.getItem('otc_intro_seen');
				if (!hasSeenIntro) {
					showIntroModal = true;
				}
			}
		}
	});

	function dismissIntro() {
		localStorage.setItem('otc_intro_seen', 'true');
		showIntroModal = false;
	}

	async function handleStructuredSend() {
		if (!tradePrice || !tradeNote.trim()) return;
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

	function parseOffer(content: string) {
		const match = content.match(/\[(WTS|WTB)\] (.*?) for (.*?) @ (.*?)(?:\n📝 Note: (.*))?/);
		if (match) {
			return {
				isOffer: true,
				type: match[1], 
				coin: match[2],
				fiat: match[3],
				price: match[4],
				note: match[5] || ''
			};
		}
		return { isOffer: false, text: content };
	}

	function generateAvatarColor(username: string) {
		let hash = 0;
		for (let i = 0; i < username.length; i++) {
			hash = username.charCodeAt(i) + ((hash << 5) - hash);
		}
		return `hsl(${Math.abs(hash) % 360}, 75%, 65%)`; 
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[100]" transition:fade={{ duration: 200 }} onclick={() => isOpen = false} aria-hidden="true"></div>

	<div class="fixed z-[101] flex flex-col overflow-hidden border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-3xl bg-white/40
		inset-4 top-20 rounded-[2rem] md:inset-auto md:right-6 md:top-24 md:bottom-6 md:w-[420px] md:rounded-[2rem]" 
		transition:scale={{ start: 0.95, opacity: 0, duration: 400, easing: backOut }}>
		
		<div class="p-4 border-b border-white/40 bg-white/30 flex items-center justify-between shrink-0">
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
					<span class="font-black text-white text-sm">{currentFiat}</span>
				</div>
				<div>
					<h2 class="text-lg font-black tracking-tight text-zinc-900 leading-tight drop-shadow-sm">OTC Nexus</h2>
					<p class="text-[11px] font-bold text-blue-700 flex items-center gap-1 uppercase tracking-wider">
						<span class="relative flex h-2 w-2">
						  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
						  <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
						</span>
						Live Order Book
					</p>
				</div>
			</div>
			
			<div class="flex items-center gap-2">
				{#if !nostrStore.username}
					<button onclick={() => showLoginPopup = true} class="text-[10px] font-bold bg-white/80 backdrop-blur-md text-zinc-900 px-3 py-1.5 rounded-xl border border-white/60 shadow-sm active:scale-95 transition-all hover:bg-white">
						Set ID
					</button>
				{:else}
					<button onclick={() => showLoginPopup = true} class="text-[10px] font-bold bg-white/60 backdrop-blur-md text-zinc-800 px-3 py-1.5 rounded-xl border border-white/60 shadow-sm flex items-center gap-1.5 hover:bg-white transition-all active:scale-95">
						<div class="w-2.5 h-2.5 rounded-full shadow-inner" style="background: {generateAvatarColor(nostrStore.username)}"></div>
						{nostrStore.username}
					</button>
				{/if}
				<button class="p-2 rounded-full hover:bg-white/60 text-zinc-600 transition-colors" onclick={() => isOpen = false}><X class="size-5" /></button>
			</div>
		</div>

		<div class="bg-rose-500/10 border-b border-rose-500/20 p-2.5 px-4 flex gap-2.5 shrink-0 items-center backdrop-blur-md">
			<ShieldAlert class="size-4 text-rose-600 shrink-0" />
			<p class="text-[10px] text-rose-800 font-semibold leading-tight drop-shadow-sm">
				Neutral Protocol. No escrow. Beware of fake QR codes.
			</p>
		</div>

		<div class="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar flex flex-col-reverse relative">
			{#if nostrStore.messages.length === 0}
				<div class="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
					<div class="w-16 h-16 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-sm">
						<Tags class="size-8 text-zinc-400" />
					</div>
					<p class="text-xs font-bold uppercase tracking-widest text-center drop-shadow-sm">No offers yet<br/>Be the first!</p>
				</div>
			{/if}

			{#each nostrStore.messages as msg (msg.id)}
				{@const isMine = msg.username === nostrStore.username}
				{@const offer = parseOffer(msg.content)}
				
				<div class="flex flex-col {isMine ? 'items-end' : 'items-start'} group w-full">
					{#if offer.isOffer}
						<div class="relative w-[90%] md:w-[85%] rounded-[20px] p-3.5 shadow-sm border transition-all duration-300 group-hover:shadow-md backdrop-blur-2xl
							{isMine ? 'bg-blue-600/90 text-white border-blue-400/50 rounded-tr-sm' : 'bg-white/70 text-zinc-900 border-white/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-tl-sm'}">
							
							<div class="flex justify-between items-center mb-2">
								<div class="flex items-center gap-2">
									{#if !isMine}
										<div class="w-5 h-5 rounded-full border border-white/60 shadow-sm flex items-center justify-center text-[9px] font-black text-white" style="background: {generateAvatarColor(msg.username)}">
											{msg.username.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="text-[11px] font-black {isMine ? 'text-blue-50' : 'text-zinc-800'} tracking-tight">
										{isMine ? 'You' : msg.username}
									</span>
								</div>
								<span class="text-[9px] font-medium {isMine ? 'text-blue-200' : 'text-zinc-500'}">{formatTime(msg.created_at)}</span>
							</div>

							<div class="flex flex-col gap-0.5 mb-2">
								<div class="flex items-center gap-2">
									<span class="px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase
										{isMine ? 'bg-blue-500/50 text-white' : (offer.type === 'WTS' ? 'bg-rose-500/10 text-rose-700' : 'bg-emerald-500/10 text-emerald-700')}">
										{offer.type === 'WTS' ? 'SELLING' : 'BUYING'} {offer.coin}
									</span>
								</div>
								<div class="flex items-baseline gap-1.5 drop-shadow-sm">
									<span class="text-2xl font-black tracking-tighter {isMine ? 'text-white' : 'text-zinc-900'}">{offer.price}</span>
									<span class="text-xs font-bold {isMine ? 'text-blue-100' : 'text-zinc-600'}">{offer.fiat}</span>
								</div>
							</div>

							{#if offer.note}
								<div class="text-[10px] font-medium px-2.5 py-1.5 rounded-xl {isMine ? 'bg-blue-700/40 text-blue-50' : 'bg-white/50 text-zinc-700 border border-white/40'}">
									<span class="opacity-70 mr-1">📝</span> {offer.note}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="p-3 border-t border-white/40 bg-white/30 backdrop-blur-3xl shrink-0">
			<form onsubmit={(e) => { e.preventDefault(); handleStructuredSend(); }} class="flex flex-col gap-2 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl p-2 shadow-sm">
				<div class="flex gap-2">
					<select bind:value={tradeType} class="bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-2 py-2 text-xs font-black tracking-wide focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-20 shadow-inner">
						<option value="WTS">WTS</option>
						<option value="WTB">WTB</option>
					</select>
					<select bind:value={tradeCoin} class="bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-2 py-2 text-xs font-black tracking-wide focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-20 shadow-inner">
						<option value="USDT">USDT</option>
						<option value="BTC">BTC</option>
						<option value="ETH">ETH</option>
					</select>
					<input type="number" step="0.01" bind:value={tradePrice} placeholder="Rate ({currentFiat})" class="flex-1 bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-3 py-2 text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-500 shadow-inner"/>
				</div>
				<div class="flex gap-2">
					<input type="text" bind:value={tradeNote} maxlength="100" placeholder="Add terms (e.g. IMPS only)..." class="flex-1 bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-500 shadow-inner"/>
					<button type="submit" disabled={!tradePrice || !tradeNote.trim()} class="bg-blue-600/90 backdrop-blur-md text-white rounded-xl px-5 py-2 flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 border border-blue-400/50">
						<Send class="size-4" />
					</button>
				</div>
			</form>
		</div>

		{#if showIntroModal}
			<div class="absolute inset-0 bg-slate-900/30 backdrop-blur-md z-[120] flex items-center justify-center p-4 md:p-6" transition:fade={{duration: 150}}>
				<div class="bg-white/85 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/80 p-6 w-full max-w-sm" transition:scale={{start: 0.95, duration: 300, easing: backOut}}>
					<div class="flex justify-center mb-4">
						<div class="h-12 w-12 rounded-full bg-blue-600/90 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
							<Zap class="size-6 text-white fill-white" />
						</div>
					</div>
					<h3 class="text-xl font-black text-zinc-900 mb-1 text-center drop-shadow-sm">Welcome to OTC Nexus</h3>
					<p class="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center mb-5">Powered by Nostr Protocol</p>
					
					<div class="space-y-4 mb-6">
						<div class="flex gap-3 items-start">
							<div class="bg-blue-100 text-blue-700 p-1.5 rounded-lg shrink-0 mt-0.5 shadow-inner"><ShieldAlert class="size-4"/></div>
							<p class="text-xs font-medium text-zinc-700 leading-relaxed">
								<strong class="text-zinc-900 font-bold block">Decentralized & Secure</strong>
								Built on Nostr (spearheaded by Jack Dorsey, founder of Twitter). No central servers. You own your data entirely.
							</p>
						</div>
						<div class="flex gap-3 items-start">
							<div class="bg-rose-100 text-rose-700 p-1.5 rounded-lg shrink-0 mt-0.5 shadow-inner"><Info class="size-4"/></div>
							<p class="text-xs font-medium text-zinc-700 leading-relaxed">
								<strong class="text-rose-600 font-bold block">Browser Bound</strong>
								No signups required! However, if you <strong class="text-zinc-900">clear your cookies or cache</strong>, your username and chat history will vanish forever.
							</p>
						</div>
					</div>
					
					<button onclick={dismissIntro} class="w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-400/50 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
						I Understand, Let's Trade
					</button>
				</div>
			</div>
		{/if}

		{#if showLoginPopup}
			<div class="absolute inset-0 bg-slate-900/20 backdrop-blur-md z-[110] flex items-center justify-center p-6" transition:fade={{duration: 150}}>
				<div class="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 w-full max-w-sm" transition:scale={{start: 0.95, duration: 300, easing: backOut}}>
					<h3 class="text-xl font-black text-zinc-900 mb-1 drop-shadow-sm">Set Identity</h3>
					<p class="text-xs font-medium text-zinc-600 mb-5">Choose how you want to appear on the OTC board. No signup required.</p>
					
					<form onsubmit={(e) => { e.preventDefault(); saveUsername(); }} class="space-y-3">
						<input type="text" bind:value={loginNameInput} placeholder="e.g. Trader_IND" maxlength="15" class="w-full bg-white/60 border border-white/80 text-zinc-900 rounded-2xl px-4 py-3.5 text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-inner"/>
						<div class="flex gap-2 pt-2">
							<button type="button" class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-700 bg-white/50 border border-white/60 hover:bg-white/80 transition-all" onclick={() => showLoginPopup = false}>Cancel</button>
							<button type="submit" disabled={loginNameInput.trim().length < 2} class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-400/50 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20">Save Profile</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
{/if}