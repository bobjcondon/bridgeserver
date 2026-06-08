<script lang="ts">
	import type { PageProps } from './$types';
	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './columns.js';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Tournaments</title>
</svelte:head>

<div class="w-full max-w-5xl">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Tournaments</h1>
		<a
			href="/tournaments/new"
			class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
		>
			+ New Tournament
		</a>
	</div>

	<DataTable data={data.tournaments} {columns} rowLabel="tournament" searchPlaceholder="Search by name or location..." />
</div>
