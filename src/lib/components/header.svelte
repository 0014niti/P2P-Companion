<script lang="ts">
	import { MoonIcon, SunIcon } from 'lucide-svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import { Button } from './ui/button';
</script>

<header class="flex items-center justify-between gap-4 py-3">
	<div>
		<h1 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">P2P Companion</h1>
		<p class="text-muted-foreground text-xs md:text-sm hidden md:block">Best P2P prices across exchanges</p>
	</div>

	<Button onclick={toggleMode} variant="outline" size="icon" title="Toggle theme" class="ml-auto">
		<SunIcon
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
		/>
		<MoonIcon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</header>
