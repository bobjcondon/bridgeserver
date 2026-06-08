<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { TournamentRow } from './columns.js';

	let { tournament }: { tournament: TournamentRow } = $props();

	const user = $derived(page.data.user as { permission?: string } | undefined);
	const isEditor = $derived(user?.permission === 'ADMIN' || user?.permission === 'DIRECTOR');
</script>

<div class="flex items-center gap-3">
	{#if tournament.closed}
		<a href="/tournaments/{tournament.id}" class="text-sm font-medium underline-offset-4 hover:underline">
			Results
		</a>
	{:else}
		<a href="/tournaments/{tournament.id}/register" class="text-sm font-medium underline-offset-4 hover:underline">
			Signup
		</a>
	{/if}

	{#if isEditor}
		<a href="/tournaments/{tournament.id}/edit" class="text-sm font-medium underline-offset-4 hover:underline">
			Edit
		</a>
		<form method="POST" action="?/delete" use:enhance>
			<input type="hidden" name="id" value={tournament.id} />
			<button
				type="submit"
				class="text-sm font-medium text-destructive underline-offset-4 hover:underline"
			>
				Delete
			</button>
		</form>
	{/if}
</div>
