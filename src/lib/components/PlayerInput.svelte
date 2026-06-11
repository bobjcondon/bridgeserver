<script lang="ts">
	type Player = { id: string; firstName: string; lastName: string; email: string | null };

	let {
		players,
		id,
		initialValue = '',
		placeholder = 'Name or email…',
		disabled = false,
		onchange
	}: {
		players: Player[];
		id: string;
		initialValue?: string;
		placeholder?: string;
		disabled?: boolean;
		onchange?: (playerId: string | null) => void;
	} = $props();

	import { untrack } from 'svelte';

	let inputText = $state(untrack(() => initialValue));
	let suggestions = $state<Player[]>([]);

	function escapeRe(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function getMatches(input: string): Player[] {
		if (input.length < 2) return [];
		const re = new RegExp(escapeRe(input), 'i');
		return players
			.filter((p) => re.test(`${p.firstName} ${p.lastName}`) || re.test(p.email ?? ''))
			.slice(0, 6);
	}

	function selectPlayer(p: Player) {
		inputText = `${p.firstName} ${p.lastName}`;
		suggestions = [];
		onchange?.(p.id);
	}

	function onInput(e: Event) {
		inputText = (e.currentTarget as HTMLInputElement).value;
		const matches = getMatches(inputText);
		if (matches.length === 1) {
			selectPlayer(matches[0]);
		} else {
			onchange?.(null);
			suggestions = matches;
		}
	}

	function onBlur() {
		setTimeout(() => {
			suggestions = [];
		}, 150);
	}
</script>

<div class="relative">
	<input
		{id}
		type="text"
		value={inputText}
		oninput={onInput}
		onblur={onBlur}
		{placeholder}
		{disabled}
		autocomplete="off"
		class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
	/>
	{#if suggestions.length > 0}
		<ul class="bg-popover text-popover-foreground absolute z-10 mt-1 w-full rounded-md border shadow-md">
			{#each suggestions as p (p.id)}
				<li>
					<button
						type="button"
						class="hover:bg-accent hover:text-accent-foreground w-full px-3 py-2 text-left text-sm"
						onmousedown={() => selectPlayer(p)}
					>
						{p.firstName} {p.lastName}
						{#if p.email}<span class="text-muted-foreground ml-1 text-xs">({p.email})</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
