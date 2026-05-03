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
		<!-- Cloudflare Web Analytics -->
		<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: "44ec1e0d3c2149539cd0349ca921085f" })}></script><!--End Cloudflare Web Analytics-->
	{/if}
</svelte:head>

<ModeWatcher />

<QueryClientProvider client={queryClient}>
	<Header />
	{@render children()}
</QueryClientProvider>
