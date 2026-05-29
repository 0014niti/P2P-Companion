<script lang="ts">
	import { ArrowRight, Calendar, BookOpen } from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>P2P Trading Blog & Insights | P2P Terminal</title>
	<meta name="description" content="Daily insights, strategies, and market analysis for peer-to-peer cryptocurrency traders." />
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute -top-[10%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-300/10 dark:bg-blue-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<main class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-12 pb-32">
	<div class="max-w-3xl mx-auto text-center mb-16">
		<span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 dark:bg-blue-900/30 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm">
			<BookOpen class="size-3.5" /> Market Insights
		</span>
		<h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">
			P2P Trading <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Blog</span>
		</h1>
		<p class="text-zinc-600 dark:text-zinc-400 text-lg font-medium leading-relaxed">
			Daily strategies, exchange updates, and arbitrage techniques to help you maximize your margins.
		</p>
	</div>

	<div class="max-w-4xl mx-auto grid gap-6">
		{#if data.posts.length === 0}
			<div class="text-center p-12 bg-white/50 dark:bg-zinc-900/50 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
				<p class="text-zinc-500 font-bold">No posts found. Add a markdown file to the /src/posts directory!</p>
			</div>
		{/if}

		{#each data.posts as post}
			<a href={`/blog/${post.slug}`} class="group flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
				<div class="flex-1">
					<div class="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-3">
						<Calendar class="size-4" />
						{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
					</div>
					<h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h2>
					<p class="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 line-clamp-2">{post.description}</p>
					<div class="flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400">
						Read Article <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</div>
			</a>
		{/each}
	</div>
</main>