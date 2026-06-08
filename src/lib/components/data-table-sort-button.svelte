<script lang="ts">
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		label,
		sorted,
		onclick
	}: {
		label: string;
		sorted: false | 'asc' | 'desc';
		onclick?: ((event: unknown) => void) | undefined;
	} = $props();
</script>

<Button variant="ghost" class="-ml-3" {onclick}>
	{label}
	{#if sorted === 'asc'}
		<ArrowUpIcon class="ml-2 size-4" />
	{:else if sorted === 'desc'}
		<ArrowDownIcon class="ml-2 size-4" />
	{:else}
		<ArrowUpDownIcon class="ml-2 size-4" />
	{/if}
</Button>
