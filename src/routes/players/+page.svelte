<script lang="ts">
	import type { PageProps } from './$types';
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Players</title>
</svelte:head>

<div class="w-full max-w-5xl">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Players</h1>
		<a
			href="/players/new"
			class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
		>
			+ New Player
		</a>
	</div>

	<DataTable data={data.players} {columns} />
</div>
