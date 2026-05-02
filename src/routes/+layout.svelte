<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores'; // <-- 1. Added page store for the canonical URL
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
</svelte:head>

<ModeWatcher />

<QueryClientProvider client={queryClient}>
	<main class="container mx-auto space-y-8 px-8 pb-20 3xl:w-4/5">
		<Header />

		<hr class="" />

		<div class="">{@render children?.()}</div>
	</main>
</QueryClientProvider>
