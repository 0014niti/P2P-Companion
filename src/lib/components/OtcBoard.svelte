<script lang="ts">
	import { nostrStore } from '$lib/nostrStore.svelte';
	import { filterState } from '$lib/components/filter/stateFilter.svelte';
	import { fly, fade } from 'svelte/transition';
	import { X, Send, ShieldAlert, User, Tags } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';

	let { isOpen = $bindable(false) } = $props();
	
	// Structured Form State
	let tradeType = $state('WTS'); // Want to Sell by default
	let tradeCoin = $state('USDT');
	let tradePrice = $state('');
	let tradeNote = $state('');

	const currentFiat = $derived(filterState.current.fiat || 'USDT');

	$effect(() => {
		if (isOpen && currentFiat) {
			nostrStore.subscribeToChannel(currentFiat);
		}
	});

	async function handleStructuredSend() {
		if (!tradePrice || !tradeNote.trim()) return;
		
		// Format into a beautiful clean message
		const content = `[${tradeType}] ${tradeCoin} for ${currentFiat} @ ${tradePrice}\n📝 Note: ${tradeNote.slice(0, 100)}`; // limit note length
		
		await nostrStore.sendMessage(content, currentFiat);
		
		// Reset inputs
		tradePrice = '';
		tradeNote = '';
	}

	function formatTime(timestamp: number) {
		return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function formatNpub(hex: string) {
		return `User_${hex.slice(0, 4)}...${hex.slice(-4)}`;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-[100]" transition:fade={{ duration: 200 }} onclick={() => isOpen = false} aria-hidden="true"></div>

	<div class="fixed inset-y-0 right-0 w-full md:w-[420px] bg-white/95 backdrop-blur-3xl border-l border-white/60 shadow-[0_0_50px_rgba(0,0,0,0.1)] z-[101] flex flex-col" transition:fly={{ x: '100%', duration: 400, easing: cubicOut }}>
		
		<div class="p-5 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-inner">
					<span class="font-black text-blue-700 text-sm">{currentFiat}</span>
				</div>
				<div>
					<h2 class="text-lg font-black tracking-tight text-zinc-900 leading-tight">Local OTC Board</h2>
					<p class="text-[11px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-wider">
						<span class="relative flex h-2 w-2">
						  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
						  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
						</span>
						Live Network
					</p>
				</div>
			</div>
			
			<div class="flex items-center gap-2">
				{#if !nostrStore.isExtensionLogin}
					<button 
						onclick={() => nostrStore.loginWithExtension()}
						class="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 shadow-sm active:scale-95"
					>
						Login
					</button>
				{:else}
					<span class="text-[10px] font-bold bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg border border-green-200 shadow-sm">
						Logged In
					</span>
				{/if}

				<button class="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors" onclick={() => isOpen = false}>
					<X class="size-5" />
				</button>
			</div>
		</div>

		<div class="bg-rose-50/80 border-b border-rose-100 p-3 px-5 flex gap-3 shrink-0">
			<ShieldAlert class="size-5 text-rose-500 shrink-0 mt-0.5" />
			<p class="text-[10px] text-rose-700 font-medium leading-relaxed">
				<strong class="font-black uppercase tracking-wider block mb-0.5">Neutral Protocol</strong>
				Unmoderated. No escrow provided. Never send funds first. Beware of scams.
			</p>
		</div>

		<div class="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar flex flex-col-reverse bg-gradient-to-b from-slate-50/30 to-white/30">
			{#if nostrStore.messages.length === 0}
				<div class="h-full flex flex-col items-center justify-center text-zinc-400 gap-3 opacity-60">
					<div class="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
						<Tags class="size-8 text-zinc-300" />
					</div>
					<p class="text-xs font-bold uppercase tracking-widest text-center">No offers found for {currentFiat}<br/>Be the first to post!</p>
				</div>
			{/if}

			{#each nostrStore.messages as msg (msg.id)}
				{@const isMine = msg.pubkey === nostrStore.publicKeyHex}
				<div class="flex flex-col {isMine ? 'items-end' : 'items-start'} group">
					<div class="flex items-center gap-1.5 mb-1 px-1">
						{#if !isMine}<User class="size-3 text-zinc-400" />{/if}
						<span class="text-[10px] font-bold text-zinc-500 {isMine ? 'text-blue-500' : ''}">
							{isMine ? 'You' : formatNpub(msg.pubkey)}
						</span>
						<span class="text-[9px] text-zinc-400 ml-1">{formatTime(msg.created_at)}</span>
					</div>
					<div class="max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm border {isMine ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm' : 'bg-white text-zinc-900 border-zinc-200/60 rounded-tl-sm group-hover:border-zinc-300 transition-colors'}">
						<p class="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="p-4 border-t border-zinc-200/60 bg-white/90 backdrop-blur-xl shrink-0">
			<form onsubmit={(e) => { e.preventDefault(); handleStructuredSend(); }} class="flex flex-col gap-2">
				<div class="flex gap-2">
					<select bind:value={tradeType} class="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-2 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
						<option value="WTS">WTS (Sell)</option>
						<option value="WTB">WTB (Buy)</option>
					</select>
					<select bind:value={tradeCoin} class="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-2 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
						<option value="USDT">USDT</option>
						<option value="BTC">BTC</option>
						<option value="ETH">ETH</option>
					</select>
					<input 
						type="number" step="0.01" 
						bind:value={tradePrice}
						placeholder="Price ({currentFiat})" 
						class="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-400 placeholder:font-normal"
					/>
				</div>
				<div class="flex gap-2">
					<input 
						type="text" 
						bind:value={tradeNote}
						maxlength="100"
						placeholder="Add note (e.g. IMPS only, fast release) max 20 words..." 
						class="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-400"
					/>
					<button type="submit" disabled={!tradePrice || !tradeNote.trim()} class="bg-blue-600 text-white rounded-xl px-4 py-2 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm active:scale-95">
						<Send class="size-4" />
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}