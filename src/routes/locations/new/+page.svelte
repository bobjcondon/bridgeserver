<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>New Location</title>
</svelte:head>

<div class="form-page">
	<h1>New Location</h1>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<form method="POST" use:enhance>
		<label>
			Name
			<input
				name="name"
				type="text"
				value={form?.name ?? ''}
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
				value={form?.email ?? ''}
				class:invalid={form?.missing === 'email'}
				required
			/>
			{#if form?.missing === 'email'}<span class="error">Required</span>{/if}
		</label>

		<label>
			Phone
			<input name="phone" type="tel" value={form?.phone ?? ''} />
		</label>

		<label>
			Address
			<input name="address" type="text" value={form?.address ?? ''} />
		</label>

		<label>
			Directions
			<textarea name="directions" rows="3">{form?.directions ?? ''}</textarea>
		</label>

		<div class="buttons">
			<button type="submit" class="btn-primary">Create Location</button>
			<a href="/locations">Cancel</a>
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
	textarea {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	input.invalid {
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
