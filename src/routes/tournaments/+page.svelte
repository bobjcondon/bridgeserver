<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function formatDate(d: Date | null) {
		if (!d) return '—';
		return new Date(d).toLocaleString();
	}
</script>

<svelte:head>
	<title>Tournaments</title>
</svelte:head>

<div class="tournaments-page">
	<div class="header">
		<h1>Tournaments</h1>
		<a href="/tournaments/new" class="btn-primary">+ New Tournament</a>
	</div>

	{#if data.tournaments.length === 0}
		<p class="empty">No tournaments yet. <a href="/tournaments/new">Add the first one.</a></p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Date &amp; Time</th>
					<th>Location</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.tournaments as tournament (tournament.id)}
					<tr>
						<td><a href="/tournaments/{tournament.id}">{tournament.name}</a></td>
						<td>{formatDate(tournament.datetime)}</td>
						<td>{tournament.locationName ?? '—'}</td>
						<td class="actions">
							<a href="/tournaments/{tournament.id}/edit">Edit</a>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={tournament.id} />
								<button type="submit" class="btn-danger">Delete</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.tournaments-page {
		max-width: 900px;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #ddd;
	}

	th {
		font-weight: 600;
		background: #f5f5f5;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.btn-primary {
		padding: 0.4rem 1rem;
		background: #4a90d9;
		color: white;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.btn-danger {
		padding: 0.3rem 0.75rem;
		background: #e74c3c;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.empty {
		color: #666;
	}
</style>
