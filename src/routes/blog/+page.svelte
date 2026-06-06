<script lang="ts">
	import { ArrowRight, Calendar, TrendingUp, Zap, Clock, Star } from 'lucide-svelte';

	let { data } = $props();
	
	// Pull out the newest post to feature it at the top!
	const featuredPost = data.posts[0];
	const regularPosts = data.posts.slice(1);
</script>

<svelte:head>
	<title>P2P Market Strategies & Viral Arbitrage Insights | P2P Terminal</title>
	<meta name="description" content="Unlock explosive peer-to-peer crypto strategies. Daily arbitrage routes, scam warnings, and market liquidity analyses." />
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute -top-[10%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-400/10 dark:bg-blue-900/20 blur-[120px]"></div>
	<div class="absolute top-[30%] -right-[10%] h-[60%] w-[50%] rounded-full bg-emerald-400/10 dark:bg-emerald-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_32px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-12 pb-32">
	<div class="max-w-4xl mx-auto text-center mb-16">
		<span class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200/60 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-4 py-1.5 text-[11px] font-black tracking-widest uppercase mb-6 shadow-sm">
			<Zap class="size-4 text-amber-500 fill-amber-500" /> Viral P2P Strategies
		</span>
		<h1 class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white mb-6 leading-[1.05]">
			Master the <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 animate-gradient-text">Arbitrage</span> Game.
		</h1>
		<p class="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
			Discover the exact routes top merchants use to capture massive spreads across Binance, OKX, and Bybit.
		</p>
	</div>

	{#if data.posts.length === 0}
		<div class="text-center p-16 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[32px] border border-dashed border-zinc-300 dark:border-zinc-700">
			<p class="text-zinc-500 font-bold text-lg">No explosive strategies published yet. Add a markdown file to /src/posts!</p>
		</div>
	{:else}
		<!-- Featured Hero Post -->
		{#if featuredPost}
			<a href={`/blog/${featuredPost.slug}`} class="group relative block mb-12 rounded-[32px] overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-500/15">
				<div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				<div class="grid md:grid-cols-2 gap-8 p-8 sm:p-12 items-center">
					<div class="order-2 md:order-1 relative z-10">
						<div class="flex items-center gap-2 mb-4">
							<span class="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-200/60 dark:border-rose-800/50 flex items-center gap-1.5"><TrendingUp class="size-3" /> Trending Now</span>
						</div>
						<h2 class="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
							{featuredPost.title}
						</h2>
						<p class="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
							{featuredPost.description}
						</p>
						<div class="flex items-center gap-4 text-xs font-bold text-zinc-500">
							<span class="flex items-center gap-1.5"><div class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-900 dark:text-white">{featuredPost.author.charAt(0)}</div> {featuredPost.author}</span>
							<span>•</span>
							<span class="flex items-center gap-1.5"><Clock class="size-3.5" /> {featuredPost.readingTime}</span>
						</div>
					</div>
					<div class="order-1 md:order-2 relative w-full aspect-video md:aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
						<div class="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-400 opacity-90 group-hover:scale-105 transition-transform duration-700"></div>
						<div class="absolute inset-0 flex items-center justify-center">
							<Star class="size-24 text-white/50 fill-white/20 drop-shadow-2xl" />
						</div>
					</div>
				</div>
			</a>
		{/if}

		<!-- Article Grid -->
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each regularPosts as post}
				<a href={`/blog/${post.slug}`} class="group flex flex-col bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
					<div class="p-6 sm:p-8 flex-1 flex flex-col">
						{#if post.tags && post.tags.length > 0}
							<div class="flex flex-wrap gap-2 mb-4">
								<span class="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-zinc-200/80 dark:border-zinc-700/80">{post.tags[0]}</span>
							</div>
						{/if}

						<h3 class="text-xl font-black text-zinc-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">{post.title}</h3>
						<p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{post.description}</p>
						
						<div class="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
							<div class="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
								<span class="flex items-center gap-1.5"><Calendar class="size-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
								<span>•</span>
								<span class="flex items-center gap-1.5"><Clock class="size-3" /> {post.readingTime}</span>
							</div>
							<div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
								<ArrowRight class="size-4" />
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>

<style>
	@keyframes gradient-shift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
	.animate-gradient-text {
		animation: gradient-shift 6s ease-in-out infinite;
		background-size: 200% 200%;
	}
</style>