<script lang="ts">
	import { browser } from '$app/environment';
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
	<title>Crypto P2P Comparison</title>
</svelte:head>

<ModeWatcher />

<QueryClientProvider client={queryClient}>
	<main class="container mx-auto space-y-8 px-8 pb-20 3xl:w-4/5">
		<Header />

		<hr class="" />

		<div class="">{@render children?.()}</div>
	</main>
</QueryClientProvider>
