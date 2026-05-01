<script lang="ts">
	import { X, Copy, Heart, ExternalLink, Mail } from 'lucide-svelte';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { toastStore } from '$lib/toast';

	let { isOpen = $bindable(false) } = $props();

	const copyToClipboard = (text: string, currency: string) => {
		navigator.clipboard.writeText(text);
		toastStore.add(`Copied ${currency} address!`, 'success');
	};

	const addresses = [
		{ name: 'USDT (TRC20)', address: 'TR6EdNsQhXnZ8dRb3dZqveJRPxZftvSyr9', icon: '💵' },
		{ name: 'Bitcoin (BTC)', address: 'bc1q87gc8eqgz2r0mkf3y37e0gazz3juvtycns83jy', icon: '₿' },
		{ name: 'Ripple (XRP)', address: 'r3ztZNv3bBcHeYkeWF3BuBcvokuWPy9EhW', icon: '✖️' }
	];
</script>

{#if isOpen}
	<div class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onclick={() => (isOpen = false)}></div>
		
		<div 
			class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
			transition:slide={{ duration: 300, easing: cubicOut, axis: 'y' }}
		>
			<div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-rose-500 to-orange-400 opacity-10"></div>
			
			<button 
				class="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white text-zinc-500 hover:text-zinc-800 rounded-full transition-colors backdrop-blur-md border border-zinc-200/50 z-10"
				onclick={() => (isOpen = false)}
			>
				<X class="w-5 h-5" />
			</button>

			<div class="p-6 pt-8 relative z-10">
				<div class="w-16 h-16 bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 border border-rose-200 shadow-sm mx-auto">
					<Heart class="w-8 h-8 text-rose-500 fill-rose-500" />
				</div>

				<h2 class="text-2xl font-black text-center text-zinc-900 mb-2 tracking-tight">Support the Project</h2>
				<p class="text-sm text-center text-zinc-600 mb-8 leading-relaxed">
					This terminal is built to be fast, free, and completely ad-light. If it helps you make profitable trades, consider supporting the server costs!
				</p>

				<div class="space-y-4">
					<a 
						href="https://www.paypal.me/14silence" 
						target="_blank" 
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#00457C] hover:bg-[#003666] text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
					>
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.11c-.473 0-.867.317-.98.758l-1.182 7.159c-.042.23-.234.39-.427.39h.34Z"/></svg>
						Donate via PayPal
						<ExternalLink class="w-4 h-4 ml-1 opacity-70" />
					</a>

					<div class="relative flex items-center py-2">
						<div class="flex-grow border-t border-zinc-200"></div>
						<span class="flex-shrink-0 mx-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Or Crypto</span>
						<div class="flex-grow border-t border-zinc-200"></div>
					</div>

					<div class="space-y-2">
						{#each addresses as crypto}
							<div class="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl hover:border-zinc-300 transition-colors group">
								<div class="flex items-center gap-3 overflow-hidden">
									<div class="w-8 h-8 bg-white rounded-lg border border-zinc-200 flex items-center justify-center text-sm shadow-sm flex-shrink-0">
										{crypto.icon}
									</div>
									<div class="overflow-hidden">
										<p class="text-xs font-bold text-zinc-800 mb-0.5">{crypto.name}</p>
										<p class="text-[10px] text-zinc-500 font-mono truncate">{crypto.address}</p>
									</div>
								</div>
								<button 
									class="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all active:scale-95 flex-shrink-0 ml-2 shadow-sm"
									onclick={() => copyToClipboard(crypto.address, crypto.name)}
									title="Copy Address"
								>
									<Copy class="w-4 h-4" />
								</button>
							</div>
						{/each}
					</div>
					
					<div class="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
						<Mail class="w-3.5 h-3.5" /> 
						Contact: <a href="mailto:p2pCompanion@proton.me" class="text-blue-600 hover:underline">p2pCompanion@proton.me</a>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
