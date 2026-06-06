<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Player } from './columns.js';

	let { player }: { player: Player } = $props();
</script>

<div class="flex items-center gap-2">
	<a href="/players/{player.id}/edit" class="text-sm font-medium underline-offset-4 hover:underline">
		Edit
	</a>
	<form method="POST" action="?/delete" use:enhance>
		<input type="hidden" name="id" value={player.id} />
		<button
			type="submit"
			class="text-sm font-medium text-destructive underline-offset-4 hover:underline"
		>
			Delete
		</button>
	</form>
</div>
