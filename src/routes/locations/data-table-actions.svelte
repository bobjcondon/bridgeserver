<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Location } from './columns.js';

	let { location }: { location: Location } = $props();
</script>

<div class="flex items-center gap-2">
	<a href="/locations/{location.id}/edit" class="text-sm font-medium underline-offset-4 hover:underline">
		Edit
	</a>
	<form method="POST" action="?/delete" use:enhance>
		<input type="hidden" name="id" value={location.id} />
		<button
			type="submit"
			class="text-sm font-medium text-destructive underline-offset-4 hover:underline"
		>
			Delete
		</button>
	</form>
</div>
