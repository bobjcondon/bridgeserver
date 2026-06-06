<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { player } = $derived(data);
</script>

<svelte:head>
	<title>{player.firstName} {player.lastName}</title>
</svelte:head>

<div class="player-page">
	<div class="header">
		<h1>{player.firstName} {player.lastName}</h1>
		<div class="header-actions">
			<a href="/players/{player.id}/edit" class="btn-secondary">Edit</a>
			<form method="POST" action="?/delete" use:enhance>
				<button type="submit" class="btn-danger">Delete</button>
			</form>
		</div>
	</div>

	<dl>
		<dt>Email</dt>
		<dd>{player.email}</dd>

		<dt>Phone</dt>
		<dd>{player.phone ?? '—'}</dd>

		<dt>Member since</dt>
		<dd>{new Date(player.createdAt).toLocaleDateString()}</dd>
	</dl>

	<p><a href="/players">← Back to Players</a></p>
</div>

<style>
	.player-page {
		max-width: 600px;
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

	.header-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	dl {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 0.5rem 1rem;
		margin-bottom: 1.5rem;
	}

	dt {
		font-weight: 600;
		color: #555;
	}

	dd {
		margin: 0;
	}

	.btn-secondary {
		padding: 0.4rem 1rem;
		background: #6c757d;
		color: white;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.btn-danger {
		padding: 0.4rem 1rem;
		background: #e74c3c;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}
</style>
