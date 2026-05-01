<script lang="ts">
    import { toastStore } from '$lib/toast';
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';
    import { CheckCircle2, AlertCircle, Info, X } from 'lucide-svelte';
</script>

<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
    {#each $toastStore as toast (toast.id)}
        <div
            animate:flip={{ duration: 300 }}
            in:fly={{ y: -20, duration: 300, easing: cubicOut }}
            out:fade={{ duration: 200 }}
            class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-sm"
        >
            <div class="shrink-0">
                {#if toast.type === 'success'}
                    <div class="flex items-center justify-center size-8 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-emerald-600 shadow-sm"><CheckCircle2 class="size-4.5" /></div>
                {:else if toast.type === 'error'}
                    <div class="flex items-center justify-center size-8 rounded-full bg-rose-100/80 border border-rose-200/60 text-rose-600 shadow-sm"><AlertCircle class="size-4.5" /></div>
                {:else}
                    <div class="flex items-center justify-center size-8 rounded-full bg-blue-100/80 border border-blue-200/60 text-blue-600 shadow-sm"><Info class="size-4.5" /></div>
                {/if}
            </div>
            <div class="flex-1 text-sm font-bold text-zinc-800 leading-tight">
                {toast.message}
            </div>
            <button class="shrink-0 p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all text-zinc-400 active:scale-95" onclick={() => toastStore.remove(toast.id)}>
                <X class="size-4" />
            </button>
        </div>
    {/each}
</div>