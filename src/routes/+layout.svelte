<script lang="ts">
	import { browser, dev } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header.svelte';
	import '@fontsource-variable/outfit';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !dev}
		<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: "5f18d97f7db84781bfe0e57cb738fadd" })}></script>{/if}
</svelte:head>

<ModeWatcher />

<QueryClientProvider client={queryClient}>
	<div class="min-h-screen flex flex-col">
		<Header />
		
		<main class="flex-grow w-full">
			{@render children()}
		</main>

		<footer class="w-full py-8 border-t border-zinc-200/50 dark:border-zinc-800/50 z-10 relative">
			<div class="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
				<p>© {new Date().getFullYear()} P2P Companion. All rights reserved.</p>
				<div class="flex items-center gap-6">
					<a href="/privacy" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
					<a href="/terms" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
					<a href="mailto:p2pcompanion@proton.me" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
				</div>
			</div>
		</footer>
	</div>
</QueryClientProvider>