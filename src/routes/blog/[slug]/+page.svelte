<script lang="ts">
	import { ArrowLeft, Calendar } from 'lucide-svelte';

	let { data } = $props();
	const { post } = data;
</script>

<svelte:head>
	<title>{post.title} | P2P Terminal Blog</title>
	<meta name="description" content={post.description} />
	
	<!-- OpenGraph SEO -->
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:type" content="article" />
	
	<!-- Twitter SEO -->
	<meta property="twitter:title" content={post.title} />
	<meta property="twitter:description" content={post.description} />
</svelte:head>

<div class="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
	<div class="absolute -top-[10%] left-[20%] h-[60%] w-[50%] rounded-full bg-blue-300/10 dark:bg-blue-900/20 blur-[120px]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
</div>

<main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8 pb-32">
	
	<a href="/blog" class="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
		<ArrowLeft class="size-4" /> Back to Blog
	</a>

	<article class="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-[32px] p-6 sm:p-12 shadow-sm">
		<header class="mb-10 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-8">
			<h1 class="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
				{post.title}
			</h1>
			<div class="flex items-center justify-center sm:justify-start gap-4 text-sm font-bold text-zinc-500">
				<span class="flex items-center gap-1.5"><Calendar class="size-4" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
				<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
				<span class="uppercase tracking-widest text-[10px] text-blue-600 dark:text-blue-400">Market Insight</span>
			</div>
		</header>

		<div class="prose prose-zinc dark:prose-invert prose-blue max-w-none prose-headings:font-black prose-a:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800">
			{@html post.html}
		</div>
	</article>
</main>