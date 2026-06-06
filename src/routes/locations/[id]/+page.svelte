<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { location } = $derived(data);
</script>

<svelte:head>
	<title>{location.name}</title>
</svelte:head>

<div class="location-page">
	<div class="header">
		<h1>{location.name}</h1>
		<div class="header-actions">
			<a href="/locations/{location.id}/edit" class="btn-secondary">Edit</a>
			<form method="POST" action="?/delete" use:enhance>
				<button type="submit" class="btn-danger">Delete</button>
			</form>
		</div>
	</div>

	<dl>
		<dt>Email</dt>
		<dd>{location.email}</dd>

		<dt>Phone</dt>
		<dd>{location.phone ?? '—'}</dd>

		<dt>Address</dt>
		<dd>{location.address ?? '—'}</dd>

		<dt>Directions</dt>
		<dd class="directions">{location.directions ?? '—'}</dd>
	</dl>

	<p><a href="/locations">← Back to Locations</a></p>
</div>

<style>
	.location-page {
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
		grid-template-columns: 120px 1fr;
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

	.directions {
		white-space: pre-wrap;
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
