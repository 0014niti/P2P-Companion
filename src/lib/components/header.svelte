<script lang="ts">
</script>

<div class="sticky top-2 sm:top-4 z-50 w-full px-3 sm:px-6 lg:px-8 flex justify-center pointer-events-none pb-2 sm:pb-4 animate-float">
	<header class="relative w-full max-w-screen-2xl rounded-2xl bg-white/40 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all pointer-events-auto dark:bg-zinc-900/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
		
		<!-- Matrix Continuous Animation Layers -->
		<div class="matrix-bg"></div>
		<div class="matrix-border"></div>

		<div class="relative z-10 px-4 sm:px-6 lg:px-8">
			<div class="flex h-14 sm:h-16 items-center justify-center">
			<a href="/" aria-label="P2P Terminal Homepage" class="group flex items-center gap-3 transition-opacity">
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
		</div>
		</div>
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