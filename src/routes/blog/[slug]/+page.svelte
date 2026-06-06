<script lang="ts">
	import { Calendar, Clock, Share2, Twitter, MessageCircle, ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';
	
	let { data } = $props();
	
	let scrollProgress = $state(0);
	
	onMount(() => {
		// Dynamic Reading Progress Bar
		const handleScroll = () => {
			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			scrollProgress = (winScroll / height) * 100;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function shareToTwitter() {
		const text = `🚨 Check out this P2P arbitrage strategy!\n\n${data.title}\n\nRead more at: ${window.location.href}`;
		window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
	}

	function shareToTelegram() {
		const text = `🚨 ${data.title}\n\nRead more at: ${window.location.href}`;
		window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
	}
</script>

<svelte:head>
	<title>{data.title} | P2P Terminal Blog</title>
	<meta name="description" content={data.description} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- Reading Progress Bar -->
<div class="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400 z-50 transition-all duration-150" style="width: {scrollProgress}%"></div>

<main class="max-w-screen-md mx-auto px-4 sm:px-6 py-12 lg:py-20 mb-32 relative">
	<a href="/blog" class="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors">
		<ArrowLeft class="size-4" /> Back to Insights
	</a>

	<!-- Viral Hero Header -->
	<header class="mb-12">
		{#if data.tags?.length}
			<div class="flex flex-wrap gap-2 mb-6">
				{#each data.tags as tag}
					<span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200/60 dark:border-blue-800/50 shadow-sm">{tag}</span>
				{/each}
			</div>
		{/if}
		
		<h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 dark:text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
			{data.title}
		</h1>
		
		<p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-8">
			{data.description}
		</p>

		<div class="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-zinc-200/60 dark:border-zinc-800/60">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-md">
					<div class="w-full h-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center text-lg font-black text-zinc-900 dark:text-white">{data.author.charAt(0)}</div>
				</div>
				<div>
					<div class="font-bold text-zinc-900 dark:text-white">{data.author}</div>
					<div class="flex items-center gap-3 text-xs font-medium text-zinc-500 mt-1">
						<span class="flex items-center gap-1.5"><Calendar class="size-3.5" /> {new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
						<span class="flex items-center gap-1.5"><Clock class="size-3.5" /> {data.readingTime}</span>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-2">Share</span>
				<button onclick={shareToTwitter} class="p-2.5 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all shadow-sm active:scale-95" aria-label="Share on Twitter"><Twitter class="size-4" /></button>
				<button onclick={shareToTelegram} class="p-2.5 rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-all shadow-sm active:scale-95" aria-label="Share on Telegram"><MessageCircle class="size-4" /></button>
				<button onclick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} class="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-sm active:scale-95" aria-label="Copy Link"><Share2 class="size-4" /></button>
			</div>
		</div>
	</header>

	<!-- Tailwind Typography Plugin auto-styles the Markdown! -->
	<article class="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none prose-headings:font-black prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-3xl prose-img:shadow-xl mt-8">
		{@html data.htmlContent}
	</article>
</main>