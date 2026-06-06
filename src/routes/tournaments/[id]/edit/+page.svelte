<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const { tournament } = $derived(data);

	function toDatetimeLocal(d: Date | null) {
		if (!d) return '';
		const dt = new Date(d);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
	}
</script>

<svelte:head>
	<title>Edit {tournament.name}</title>
</svelte:head>

<div class="form-page">
	<h1>Edit Tournament</h1>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<form method="POST" use:enhance>
		<label>
			Name
			<input
				name="name"
				type="text"
				value={form?.name ?? tournament.name}
				class:invalid={form?.missing === 'name'}
				required
			/>
			{#if form?.missing === 'name'}<span class="error">Required</span>{/if}
		</label>

		<label>
			Email
			<input
				name="email"
				type="email"
				value={form?.email ?? tournament.email}
				class:invalid={form?.missing === 'email'}
				required
			/>
			{#if form?.missing === 'email'}<span class="error">Required</span>{/if}
		</label>

		<label>
			Location
			<select name="locationId" class:invalid={form?.missing === 'locationId'} required>
				<option value="">— Select a location —</option>
				{#each data.locations as loc (loc.id)}
					<option
						value={loc.id}
						selected={(form?.locationId ?? tournament.locationId) === loc.id}
					>{loc.name}</option>
				{/each}
			</select>
			{#if form?.missing === 'locationId'}<span class="error">Required</span>{/if}
		</label>

		<label>
			Date &amp; Time
			<input
				name="datetime"
				type="datetime-local"
				value={form?.datetimeRaw ?? toDatetimeLocal(tournament.datetime)}
			/>
		</label>

		<div class="buttons">
			<button type="submit" class="btn-primary">Save Changes</button>
			<a href="/tournaments/{tournament.id}">Cancel</a>
		</div>
	</form>
</div>

<style>
	.form-page {
		max-width: 480px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-weight: 500;
	}

	input,
	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	input.invalid,
	select.invalid {
		border-color: #e74c3c;
	}

	.error {
		color: #e74c3c;
		font-size: 0.85rem;
		font-weight: normal;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 0.5rem;
	}

	.btn-primary {
		padding: 0.5rem 1.25rem;
		background: #4a90d9;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}
</style>
