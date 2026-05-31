<script lang="ts">
	import { ShieldAlert, Search, BookOpen, Activity, Zap } from 'lucide-svelte';
	import { i18n } from '$lib/i18n/index.svelte.ts';
</script>

<div class="sticky top-2 sm:top-4 z-[100] w-full px-3 sm:px-6 lg:px-8 flex justify-center pointer-events-none pb-2 sm:pb-4 animate-float">
	<header class="relative w-full max-w-screen-2xl rounded-2xl bg-white/40 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all pointer-events-auto dark:bg-zinc-900/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
		
		<div class="matrix-bg"></div>
		<div class="matrix-border"></div>

		<div class="relative z-10 px-3 sm:px-6 lg:px-8">
			<div class="flex h-14 sm:h-16 items-center justify-between w-full gap-3 sm:gap-4">
				
				<a href="/" aria-label="P2P Terminal Homepage" class="group flex items-center gap-2 sm:gap-3 transition-opacity shrink-0">
					<div class="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 overflow-hidden">
						<div class="absolute inset-0 bg-emerald-400 mix-blend-overlay opacity-0 group-hover:opacity-50 animate-pulse"></div>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="relative z-10 h-5 w-5 text-white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
					</div>
					
					<div class="flex-col mt-0.5 hidden min-[360px]:flex">
						<div class="flex items-baseline gap-2">
							<span class="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
								P2P <span class="font-medium text-zinc-500 dark:text-zinc-400">Terminal</span>
							</span>
						</div>
						<p class="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-zinc-400 uppercase mt-1">
							by P2P Companion
						</p>
					</div>
				</a>

				<!-- Scrollable Unified Nav -->
				<div class="flex-1 overflow-hidden relative flex items-center justify-end">
					<div class="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto hide-scrollbar w-full justify-start sm:justify-end pb-1 pt-1 snap-x scroll-smooth">
						
						<button onclick={() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', metaKey: true}))} class="snap-start shrink-0 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all active:scale-95 group">
							<Search class="size-3.5 sm:size-4" />
							<span>{i18n.t('nav.search')}</span>
						</button>

						<a href="/markets" class="snap-start shrink-0 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/50 dark:bg-zinc-800/50 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all active:scale-95">
							<Activity class="size-3.5 sm:size-4" />
							<span>{i18n.t('nav.liveMarkets')}</span>
						</a>

						<a href="/arbitrage" class="snap-start shrink-0 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 sm:px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-95">
							<Zap class="size-3.5 sm:size-4" />
							<span>{i18n.t('nav.scanner')}</span>
						</a>

						<a href="/scam-check" class="snap-start shrink-0 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50/50 dark:bg-rose-900/20 px-2.5 sm:px-3 py-1.5 rounded-lg border border-rose-200/50 dark:border-rose-800/50 shadow-sm transition-all active:scale-95">
							<ShieldAlert class="size-3.5 sm:size-4" />
							<span>{i18n.t('nav.scamCheck')}</span>
						</a>

						<a href="/blog" class="snap-start shrink-0 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/50 dark:bg-zinc-800/50 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all active:scale-95">
							<BookOpen class="size-3.5 sm:size-4" />
							<span>{i18n.t('nav.blog')}</span>
						</a>
						
						<select 
							value={i18n.locale} 
							onchange={(e) => i18n.setLocale(e.currentTarget.value as any)}
							class="snap-start shrink-0 text-[11px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50 px-2 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm outline-none cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors uppercase"
						>
							<option value="en">EN</option>
							<option value="es">ES</option>
							<option value="ru">RU</option>
						</select>

					</div>
				</div>
			</div>
		</div>

	</header>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

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