<script lang="ts">
	import { nostrStore } from '$lib/nostrStore.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { X, Send, ShieldAlert, Tags, Zap, KeyRound, ChevronLeft, Lock } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';

	let { isOpen = $bindable(false) } = $props();
	
	let tradeType = $state('WTS');
	let tradeCoin = $state('USDT');
	let tradePrice = $state('');
	let tradeNote = $state('');

	let showAccountModal = $state(false);
	let showIntroModal = $state(false);
	
	let loginNameInput = $state('');
	let restoreKeyInput = $state('');
	let isKeyCopied = $state(false);

	// 🌟 FIX: Added `offerContext` so the VIP room remembers the price!
	let activeDm = $state<{pubkey: string, username: string, offerContext?: any} | null>(null);
	let dmInput = $state('');

	const currentFiat = $derived(filterState.current.fiat || 'USDT');
	const currentDMs = $derived(activeDm ? nostrStore.dmMessages.filter(m => m.targetPubkey === activeDm?.pubkey) : []);

	$effect(() => {
		if (isOpen && currentFiat) {
			nostrStore.subscribeToChannel(currentFiat);
			if (typeof window !== 'undefined' && !localStorage.getItem('otc_intro_seen')) {
				showIntroModal = true;
			}
		}
		// 🌟 NEW: Clear the badges when the user is actively looking at the chat
		if (isOpen) {
			if (!activeDm) {
				nostrStore.markGlobalRead(); // Looking at global feed
			} else {
				nostrStore.markPrivateRead(); // Looking at VIP room
			}
		}
	});

	function dismissIntro() {
		localStorage.setItem('otc_intro_seen', 'true');
		showIntroModal = false;
	}

	async function handleGlobalSend() {
		if (!tradePrice || !tradeNote.trim()) return;
		const content = `[${tradeType}] ${tradeCoin} for ${currentFiat} @ ${tradePrice}\n📝 Note: ${tradeNote.slice(0, 100)}`;
		await nostrStore.sendMessage(content, currentFiat);
		tradePrice = ''; tradeNote = '';
	}

	async function handleDMSend() {
		if (!dmInput.trim() || !activeDm) return;
		await nostrStore.sendDM(activeDm.pubkey, dmInput);
		dmInput = '';
	}

	function saveUsername() {
		if (loginNameInput.trim().length > 1) {
			nostrStore.setUsername(loginNameInput.trim());
		}
		if (restoreKeyInput.trim().length > 10) {
			nostrStore.restoreFromKey(restoreKeyInput);
		}
		showAccountModal = false;
	}

	function copyPrivateKey() {
		if (nostrStore.secretKeyHex) {
			navigator.clipboard.writeText(nostrStore.secretKeyHex);
			isKeyCopied = true;
			setTimeout(() => isKeyCopied = false, 2000);
		}
	}

	function formatTime(timestamp: number) { return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
	
	function generateAvatarColor(username: string) {
		let hash = 0;
		for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
		return `hsl(${Math.abs(hash) % 360}, 75%, 65%)`; 
	}

		// 🌟 FIX: Bulletproof String Parser (Ignores weird mobile formatting!)
	function parseOffer(content: string) {
		try {
			if (content.includes('[WTS]') || content.includes('[WTB]')) {
				const type = content.includes('[WTS]') ? 'WTS' : 'WTB';
				
				const part1 = content.split('] ')[1];
				const coin = part1.split(' for ')[0].trim();
				
				const part2 = part1.split(' for ')[1];
				const fiat = part2.split(' @ ')[0].trim();
				
				const part3 = part2.split(' @ ')[1];
				const price = part3.split('\n')[0].trim(); // Grabs the price cleanly
				
				let note = '';
				if (content.includes('Note:')) {
					note = content.split('Note:')[1].trim(); // Grabs the note cleanly
				}

				return { isOffer: true, type, coin, fiat, price, note };
			}
		} catch (e) {
			console.warn("Could not parse offer strictly, falling back to text bubble.");
		}
		return { isOffer: false, text: content };
	}

</script>

{#if isOpen}
	<div class="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[100]" transition:fade={{ duration: 200 }} onclick={() => isOpen = false} aria-hidden="true"></div>

	<div class="fixed z-[101] flex flex-col overflow-hidden border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-3xl transition-colors duration-500
		{activeDm ? 'bg-zinc-900/95 border-zinc-700/50' : 'bg-white/40'}
		inset-4 top-20 rounded-[2rem] md:inset-auto md:right-6 md:top-24 md:bottom-6 md:w-[420px] md:rounded-[2rem]" 
		transition:scale={{ start: 0.95, opacity: 0, duration: 400, easing: backOut }}>
		
		<div class="p-4 border-b flex items-center justify-between shrink-0 {activeDm ? 'border-zinc-700/50 bg-zinc-800/80' : 'border-white/40 bg-white/30'}">
			{#if !activeDm}
				<div class="flex items-center gap-3">
					<div class="h-10 w-10 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
						<span class="font-black text-white text-sm">{currentFiat}</span>
					</div>
					<div>
						<h2 class="text-lg font-black tracking-tight text-zinc-900 leading-tight drop-shadow-sm">OTC Nexus</h2>
						<p class="text-[11px] font-bold text-blue-700 flex items-center gap-1 uppercase tracking-wider">
							<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
							Live Order Book
						</p>
					</div>
				</div>
			{:else}
				<div class="flex items-center gap-3">
					<button onclick={() => activeDm = null} class="p-2 rounded-full hover:bg-zinc-700/50 text-zinc-300 transition-colors"><ChevronLeft class="size-5" /></button>
					<div class="w-10 h-10 rounded-full border-2 border-zinc-700 flex items-center justify-center text-sm font-black text-white shadow-lg" style="background: {generateAvatarColor(activeDm.username)}">
						{activeDm.username.charAt(0).toUpperCase()}
					</div>
					<div>
						<h2 class="text-lg font-black tracking-tight text-white leading-tight flex items-center gap-1.5">{activeDm.username} <Lock class="size-3 text-emerald-400"/></h2>
						<p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Encrypted VIP Room</p>
					</div>
				</div>
			{/if}
			
			<div class="flex items-center gap-2">
				{#if !activeDm}
					{#if !nostrStore.username}
						<button onclick={() => showAccountModal = true} class="text-[10px] font-bold bg-white/80 backdrop-blur-md text-zinc-900 px-3 py-1.5 rounded-xl border border-white/60 shadow-sm active:scale-95 transition-all hover:bg-white">Account</button>
					{:else}
						<button onclick={() => showAccountModal = true} class="text-[10px] font-bold bg-white/60 backdrop-blur-md text-zinc-800 px-3 py-1.5 rounded-xl border border-white/60 shadow-sm flex items-center gap-1.5 hover:bg-white transition-all active:scale-95">
							<div class="w-2.5 h-2.5 rounded-full shadow-inner" style="background: {generateAvatarColor(nostrStore.username)}"></div>
							{nostrStore.username}
						</button>
					{/if}
					<button class="p-2 rounded-full hover:bg-white/60 text-zinc-600 transition-colors" onclick={() => isOpen = false}><X class="size-5" /></button>
				{:else}
					<button class="p-2 rounded-full hover:bg-zinc-700/50 text-zinc-400 transition-colors" onclick={() => isOpen = false}><X class="size-5" /></button>
				{/if}
			</div>
		</div>

		{#if !activeDm}
			<div class="bg-rose-500/10 border-b border-rose-500/20 p-2.5 px-4 flex gap-2.5 shrink-0 items-center backdrop-blur-md">
				<ShieldAlert class="size-4 text-rose-600 shrink-0" />
				<p class="text-[10px] text-rose-800 font-semibold leading-tight drop-shadow-sm">Neutral Protocol. No escrow. Beware of scams.</p>
			</div>
		{/if}

		{#if activeDm && activeDm.offerContext?.isOffer}
			<div class="bg-zinc-800/50 border-b border-zinc-700/50 p-3 px-4 flex justify-between items-center shrink-0 z-10" transition:slide>
				<div class="flex items-center gap-2">
					<span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ref:</span>
					<span class="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase {activeDm.offerContext.type === 'WTS' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}">
						{activeDm.offerContext.type} {activeDm.offerContext.coin}
					</span>
				</div>
				<div class="flex items-baseline gap-1">
					<span class="text-xl font-black tracking-tighter text-white drop-shadow-sm">{activeDm.offerContext.price}</span>
					<span class="text-[10px] font-bold text-zinc-400">{activeDm.offerContext.fiat}</span>
				</div>
			</div>
		{/if}

		<div class="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar flex flex-col-reverse relative">
			
			{#if !activeDm}
				{#if nostrStore.messages.length === 0}
					<div class="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
						<div class="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center shadow-sm"><Tags class="size-8 text-zinc-400" /></div>
						<p class="text-xs font-bold uppercase tracking-widest text-center drop-shadow-sm">No offers yet<br/>Be the first!</p>
					</div>
				{/if}

				{#each nostrStore.messages as msg (msg.id)}
					{@const isMine = msg.username === nostrStore.username}
					{@const offer = parseOffer(msg.content)}
					
					<div class="flex flex-col {isMine ? 'items-end' : 'items-start'} group w-full">
						{#if offer.isOffer}
							<div class="relative w-[90%] md:w-[85%] rounded-[20px] p-3.5 shadow-sm border transition-all duration-300 group-hover:shadow-md backdrop-blur-2xl
								{isMine ? 'bg-blue-600/90 text-white border-blue-400/50 rounded-tr-sm' : 'bg-white/70 text-zinc-900 border-white/60 rounded-tl-sm cursor-pointer hover:bg-white/90 hover:scale-[1.02]'}"
								onclick={() => { 
									if(!isMine) {
										if (nostrStore.isRestoredAccount) {
											activeDm = {pubkey: msg.pubkey, username: msg.username, offerContext: offer};
										} else {
											alert("🔒 VIP Room Locked!\n\nTo prevent losing access to your private negotiations, you must explicitly import your Private Key in the Account menu first.");
											showAccountModal = true;
										}
									} 
								}}
								role="button" tabindex="0">
								
								<div class="flex justify-between items-center mb-2">
									<div class="flex items-center gap-2">
										{#if !isMine}
											<div class="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center text-[9px] font-black text-white" style="background: {generateAvatarColor(msg.username)}">{msg.username.charAt(0).toUpperCase()}</div>
										{/if}
										<span class="text-[11px] font-black {isMine ? 'text-blue-50' : 'text-zinc-800'} tracking-tight">
											{isMine ? 'You' : msg.username} <span class="text-[9px] font-normal opacity-60 ml-1">(Click to DM)</span>
										</span>
									</div>
									<span class="text-[9px] font-medium {isMine ? 'text-blue-200' : 'text-zinc-500'}">{formatTime(msg.created_at)}</span>
								</div>

								<div class="flex flex-col gap-0.5 mb-2">
									<div class="flex items-center gap-2">
										<span class="px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase {isMine ? 'bg-blue-500/50 text-white' : (offer.type === 'WTS' ? 'bg-rose-500/10 text-rose-700' : 'bg-emerald-500/10 text-emerald-700')}">
											{offer.type === 'WTS' ? 'SELLING' : 'BUYING'} {offer.coin}
										</span>
									</div>
									<div class="flex items-baseline gap-1.5 drop-shadow-sm">
										<span class="text-2xl font-black tracking-tighter {isMine ? 'text-white' : 'text-zinc-900'}">{offer.price}</span>
										<span class="text-xs font-bold {isMine ? 'text-blue-100' : 'text-zinc-600'}">{offer.fiat}</span>
									</div>
								</div>

								{#if offer.note}
									<div class="text-[10px] font-medium px-2.5 py-1.5 rounded-xl {isMine ? 'bg-blue-700/40 text-blue-50' : 'bg-white/50 text-zinc-700 border border-white/40'}"><span class="opacity-70 mr-1">📝</span> {offer.note}</div>
								{/if}
							</div>
						
						{:else}
							<div class="relative max-w-[85%] rounded-[20px] px-4 py-3 text-sm shadow-sm border transition-all duration-300 backdrop-blur-2xl
								{isMine ? 'bg-blue-600/90 text-white border-blue-400/50 rounded-tr-sm' : 'bg-white/70 text-zinc-900 border-white/60 rounded-tl-sm'}">
								<div class="flex justify-between items-center mb-1">
									<div class="flex items-center gap-2">
										{#if !isMine}
											<div class="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center text-[8px] font-black text-white" style="background: {generateAvatarColor(msg.username)}">{msg.username.charAt(0).toUpperCase()}</div>
										{/if}
										<span class="text-[10px] font-bold {isMine ? 'text-blue-200' : 'text-zinc-600'}">{isMine ? 'You' : msg.username}</span>
									</div>
									<span class="text-[8px] opacity-70 ml-3">{formatTime(msg.created_at)}</span>
								</div>
								<p class="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
							</div>
						{/if}
					</div>			
				{/each}

			{:else}
				{#if currentDMs.length === 0}
					<div class="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
						<Lock class="size-10 text-zinc-700/50" />
						<p class="text-xs font-bold uppercase tracking-widest text-center">End-to-End Encrypted<br/>Say hello!</p>
					</div>
				{/if}

				{#each currentDMs as msg (msg.id)}
					{@const isMine = msg.pubkey === nostrStore.publicKeyHex}
					<div class="flex flex-col w-full {isMine ? 'items-end' : 'items-start'}">
						<div class="flex items-center gap-1.5 mb-1 px-1">
							<span class="text-[9px] font-bold {isMine ? 'text-blue-400' : 'text-zinc-400'}">{isMine ? 'You' : activeDm.username}</span>
							<span class="text-[8px] text-zinc-600">{formatTime(msg.created_at)}</span>
						</div>
						<div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm border {isMine ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm' : 'bg-zinc-800 text-zinc-100 border-zinc-700 rounded-tl-sm'}">
							<p class="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		{#if !activeDm}
			<div class="p-3 border-t border-white/40 bg-white/30 backdrop-blur-3xl shrink-0" transition:slide>
				<form onsubmit={(e) => { e.preventDefault(); handleGlobalSend(); }} class="flex flex-col gap-2 bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl p-2 shadow-sm">
					<div class="flex gap-2">
						<select bind:value={tradeType} class="bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-2 py-2 text-xs font-black focus:outline-none w-20 shadow-inner"><option value="WTS">WTS</option><option value="WTB">WTB</option></select>
						<select bind:value={tradeCoin} class="bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-2 py-2 text-xs font-black focus:outline-none w-20 shadow-inner"><option value="USDT">USDT</option><option value="BTC">BTC</option></select>
						<input type="number" step="0.01" bind:value={tradePrice} placeholder="Rate ({currentFiat})" class="flex-1 bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-3 py-2 text-xs font-black focus:outline-none placeholder:text-zinc-500 shadow-inner"/>
					</div>
					<div class="flex gap-2">
						<input type="text" bind:value={tradeNote} maxlength="100" placeholder="Add terms..." class="flex-1 bg-white/60 border border-white/40 text-zinc-900 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none placeholder:text-zinc-500 shadow-inner"/>
						<button type="submit" disabled={!tradePrice || !tradeNote.trim()} class="bg-blue-600 text-white rounded-xl px-5 py-2 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 shadow-md"><Send class="size-4" /></button>
					</div>
				</form>
			</div>
		{:else}
			<div class="p-3 border-t border-zinc-700/50 bg-zinc-800/80 backdrop-blur-xl shrink-0" transition:slide>
				<form onsubmit={(e) => { e.preventDefault(); handleDMSend(); }} class="flex gap-2">
					<input type="text" bind:value={dmInput} placeholder="Type encrypted message..." class="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-zinc-500"/>
					<button type="submit" disabled={!dmInput.trim()} class="bg-blue-600 text-white rounded-xl px-5 flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 transition-all active:scale-95"><Send class="size-4" /></button>
				</form>
			</div>
		{/if}

		{#if showAccountModal}
			<div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-6" transition:fade={{duration: 150}}>
				<div class="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white p-6 w-full max-w-sm flex flex-col" transition:scale={{start: 0.95, duration: 300, easing: backOut}}>
					
					{#if nostrStore.isRestoredAccount}
						<div class="flex items-center justify-between mb-5 border-b border-zinc-100 pb-4">
							<div class="flex items-center gap-3">
								<div class="w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center text-lg font-black text-white" style="background: {generateAvatarColor(nostrStore.username || 'Anon')}">
									{(nostrStore.username || 'A').charAt(0).toUpperCase()}
								</div>
								<div>
									<h3 class="text-xl font-black text-zinc-900 leading-tight">{nostrStore.username || 'Syncing...'}</h3>
									<p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1"><Lock class="size-3"/> Verified Account</p>
								</div>
							</div>
						</div>

						<div class="space-y-2 mb-6">
							<label class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Your Private Key (Master Password)</label>
							<div class="flex gap-2">
								<input type="text" readonly value={nostrStore.secretKeyHex} class="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2.5 text-xs font-mono blur-[4px] hover:blur-none transition-all cursor-pointer shadow-inner"/>
								<button type="button" onclick={copyPrivateKey} class="px-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-xs font-bold shadow-sm">
									{isKeyCopied ? 'Copied!' : 'Copy'}
								</button>
							</div>
							<p class="text-[10px] text-zinc-500 font-medium leading-relaxed bg-rose-50 p-2 rounded-xl border border-rose-100 text-rose-700">
								<strong>⚠️ Do not lose this!</strong> You will need this key to log in on other devices.
							</p>
						</div>

						<div class="flex gap-2 pt-2">
							<button type="button" class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all" onclick={() => showAccountModal = false}>Close</button>
							<button type="button" class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all" onclick={() => nostrStore.logout()}>Log Out</button>
						</div>
					{:else}
						<div class="flex bg-zinc-100 p-1 rounded-2xl mb-5 shadow-inner">
							<button class="flex-1 py-2 text-xs font-bold rounded-xl transition-all {!restoreKeyInput ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}" onclick={() => restoreKeyInput = ''}>Sign Up</button>
							<button class="flex-1 py-2 text-xs font-bold rounded-xl transition-all {restoreKeyInput ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}" onclick={() => restoreKeyInput = ' '}>Sign In</button>
						</div>

						{#if !restoreKeyInput}
							<form onsubmit={(e) => { e.preventDefault(); nostrStore.createOfficialAccount(loginNameInput); }} class="space-y-4">
								<div>
									<h3 class="text-xl font-black text-zinc-900 mb-1">Create Account</h3>
									<p class="text-[11px] font-medium text-zinc-500 leading-tight">No email or password needed. We instantly generate a highly secure Web3 identity for you.</p>
								</div>
								<div class="space-y-1.5">
									<label class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Choose an Account ID</label>
									<input type="text" bind:value={loginNameInput} placeholder="e.g. BinanceWhale" maxlength="15" class="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-inner"/>
								</div>
								<div class="flex gap-2 pt-2">
									<button type="button" class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all" onclick={() => showAccountModal = false}>Cancel</button>
									<button type="submit" disabled={loginNameInput.trim().length < 2} class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50">Create Keys</button>
								</div>
							</form>
						{:else}
							<form onsubmit={(e) => { e.preventDefault(); nostrStore.restoreFromKey(restoreKeyInput); }} class="space-y-4">
								<div>
									<h3 class="text-xl font-black text-zinc-900 mb-1">Welcome Back</h3>
									<p class="text-[11px] font-medium text-zinc-500 leading-tight">Paste your Private Key below to restore your account, username, and encrypted chats.</p>
								</div>
								<div class="space-y-1.5">
									<label class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Private Key</label>
									<input type="password" bind:value={restoreKeyInput} placeholder="Paste 64-character hex key..." class="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-inner"/>
								</div>
								<div class="flex gap-2 pt-2">
									<button type="button" class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all" onclick={() => showAccountModal = false}>Cancel</button>
									<button type="submit" disabled={restoreKeyInput.trim().length < 60} class="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-all shadow-md shadow-zinc-900/20 disabled:opacity-50">Sign In</button>
								</div>
							</form>
						{/if}
					{/if}
				</div>
			</div>
		{/if}

		{#if showIntroModal}
			<div class="absolute inset-0 bg-slate-900/30 backdrop-blur-md z-[120] flex items-center justify-center p-4 md:p-6" transition:fade={{duration: 150}}>
				<div class="bg-white/85 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/80 p-6 w-full max-w-sm" transition:scale={{start: 0.95, duration: 300, easing: backOut}}>
					<div class="flex justify-center mb-4"><div class="h-12 w-12 rounded-full bg-blue-600/90 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]"><Zap class="size-6 text-white fill-white" /></div></div>
					<h3 class="text-xl font-black text-zinc-900 mb-1 text-center drop-shadow-sm">Welcome to OTC Nexus</h3>
					<p class="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center mb-5">Powered by Nostr Protocol</p>
					<div class="space-y-4 mb-6">
						<div class="flex gap-3 items-start">
							<div class="bg-blue-100 text-blue-700 p-1.5 rounded-lg shrink-0 mt-0.5 shadow-inner"><ShieldAlert class="size-4"/></div>
							<p class="text-xs font-medium text-zinc-700 leading-relaxed"><strong class="text-zinc-900 font-bold block">Decentralized & Secure</strong> Built on Nostr. No central servers. You own your data entirely.</p>
						</div>
					</div>
					<button onclick={dismissIntro} class="w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-400/50 transition-all shadow-lg active:scale-95">I Understand, Let's Trade</button>
				</div>
			</div>
		{/if}
	</div>
{/if}