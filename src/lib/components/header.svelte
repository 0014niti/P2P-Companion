<script lang="ts">
	import { ShieldAlert, Menu, X, Search } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let isMobileMenuOpen = $state(false);
</script>

<div class="sticky top-2 sm:top-4 z-[100] w-full px-3 sm:px-6 lg:px-8 flex justify-center pointer-events-none pb-2 sm:pb-4 animate-float">
	<header class="relative w-full max-w-screen-2xl rounded-2xl bg-white/40 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all pointer-events-auto dark:bg-zinc-900/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
		
		<div class="matrix-bg"></div>
		<div class="matrix-border"></div>

		<div class="relative z-10 px-4 sm:px-6 lg:px-8">
			<div class="flex h-14 sm:h-16 items-center justify-between w-full">
				
				<a href="/" aria-label="P2P Terminal Homepage" class="group flex items-center gap-3 transition-opacity" onclick={() => isMobileMenuOpen = false}>
					<div class="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 overflow-hidden">
						<div class="absolute inset-0 bg-emerald-400 mix-blend-overlay opacity-0 group-hover:opacity-50 animate-pulse"></div>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="relative z-10 h-5 w-5 text-white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
					</div>
					
					<div class="flex flex-col mt-0.5">
						<div class="flex items-baseline gap-2">
							<span class="text-xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
								P2P <span class="font-medium text-zinc-500 dark:text-zinc-400">Terminal</span>
							</span>
							<span class="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:inline-block text-[9px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
								By Dr.N
							</span>
						</div>
						
						<p class="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-zinc-400 uppercase mt-1.5">
							by P2P Companion <span class="text-zinc-300/50 dark:text-zinc-700">|</span> Live Data
						</p>
					</div>
				</a>

				<!-- Desktop Nav -->
				<div class="hidden md:flex items-center gap-4">
					<button onclick={() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', metaKey: true}))} class="flex items-center gap-3 text-sm font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all active:scale-95 group">
						<Search class="size-4" />
						<span class="hidden lg:inline-block">Search...</span>
						<span class="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[9px] uppercase tracking-widest shadow-inner group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
							<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg> K
						</span>
					</button>
					<a href="/blog" class="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white/50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm active:scale-95">
						Blog
					</a>
					<a href="/markets" class="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white/50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm active:scale-95">
						Live Markets
					</a>
					<a href="/scam-check" class="flex items-center gap-1.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors bg-rose-50/50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg border border-rose-200/50 dark:border-rose-800/50 shadow-sm active:scale-95" title="Verify Merchant Reputation">
						<ShieldAlert class="size-4" />
						Scam Check
					</a>
					<a href="/arbitrage" class="text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-95 flex items-center gap-1.5">
						<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
						Scanner
					</a>
				</div>

				<!-- Mobile Nav Toggle -->
				<div class="flex md:hidden items-center gap-2">
					<a href="/arbitrage" class="text-[11px] font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1" onclick={() => isMobileMenuOpen = false}>
						<svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
						Scanner
					</a>
					<button onclick={() => isMobileMenuOpen = !isMobileMenuOpen} aria-label="Toggle Menu" class="p-1.5 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 active:scale-95 transition-all">
						{#if isMobileMenuOpen}
							<X class="size-5" />
						{:else}
							<Menu class="size-5" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Dropdown Layout -->
		{#if isMobileMenuOpen}
			<div transition:slide={{ duration: 300, easing: cubicOut }} class="md:hidden border-t border-zinc-200/50 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-900/50 relative z-20">
				<div class="flex flex-col p-4 gap-3">
					<a href="/blog" onclick={() => isMobileMenuOpen = false} class="block px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm active:scale-95 transition-all">Blog</a>
					<a href="/markets" onclick={() => isMobileMenuOpen = false} class="block px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm active:scale-95 transition-all">Live Markets</a>
					<a href="/scam-check" onclick={() => isMobileMenuOpen = false} class="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200/50 dark:border-rose-800/50 text-sm font-bold text-rose-600 dark:text-rose-400 shadow-sm active:scale-95 transition-all">
						<ShieldAlert class="size-4" /> Scam Check
					</a>
				</div>
			</div>
		{/if}
	</header>
</div>

<style>
	/* Floating Animation */
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	/* Matrix Falling Background */
	.matrix-bg {
		position: absolute;
		inset: 0;
		border-radius: 1rem;
		overflow: hidden;
		pointer-events: none;
	}
	.matrix-bg::before {
		content: "";
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			180deg,
			rgba(16, 185, 129, 0) 0%,
			rgba(16, 185, 129, 0.05) 50%,
			rgba(16, 185, 129, 0) 100%
		);
		background-size: 100% 200%;
		animation: matrix-rain 3s linear infinite;
	}
	:global(.dark) .matrix-bg::before {
		background: repeating-linear-gradient(
			180deg,
			rgba(16, 185, 129, 0) 0%,
			rgba(16, 185, 129, 0.15) 50%,
			rgba(16, 185, 129, 0) 100%
		);
	}
	@keyframes matrix-rain {
		0% { background-position: 0% -200%; }
		100% { background-position: 0% 0%; }
	}

	/* Matrix Glowing Flow Border */
	.matrix-border {
		position: absolute;
		inset: 0;
		border-radius: 1rem;
		padding: 1px;
		background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.8), rgba(59, 130, 246, 0.1));
		background-size: 200% 100%;
		animation: matrix-flow 3s linear infinite;
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
	}
	:global(.dark) .matrix-border {
		background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 1), rgba(59, 130, 246, 0.2));
		background-size: 200% 100%;
	}
	@keyframes matrix-flow {
		0% { background-position: 200% 0; }
		100% { background-position: 0 0; }
	}
</style>