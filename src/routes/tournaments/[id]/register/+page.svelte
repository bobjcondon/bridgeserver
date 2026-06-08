<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import * as Table from '$lib/components/ui/table/index.js';

	type Player = { id: string; firstName: string; lastName: string; email: string | null };
	type PRow = {
		player1Id: string | null;
		player1Name: string;
		player2Id: string | null;
		player2Name: string;
		tournamentId: string | null;
	};

	let { data, form }: PageProps = $props();

	// ── Player 1 ──────────────────────────────────────────────
	let p1Input = $state('');
	let p1Id = $state<string | null>(null);
	let p1Suggestions = $state<Player[]>([]);

	// ── Player 2 ──────────────────────────────────────────────
	let p2Input = $state('');
	let p2Id = $state<string | null>(null);
	let p2Suggestions = $state<Player[]>([]);

	// ── Selected row ──────────────────────────────────────────
	let selectedKey = $state<string | null>(null);

	// ── Helpers ───────────────────────────────────────────────
	function rowKey(r: PRow) {
		return `${r.player1Id}:${r.tournamentId}`;
	}

	function formatDate(d: Date | null) {
		if (!d) return '—';
		return new Date(d).toLocaleString();
	}

	function escapeRe(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function getMatches(input: string): Player[] {
		if (input.length < 2) return [];
		const re = new RegExp(escapeRe(input), 'i');
		return (data.players as Player[])
			.filter(p => re.test(`${p.firstName} ${p.lastName}`) || re.test(p.email ?? ''))
			.slice(0, 6);
	}

	// ── Player 1 handlers ─────────────────────────────────────
	function onP1Input(e: Event) {
		const val = (e.currentTarget as HTMLInputElement).value;
		p1Input = val;
		p1Id = null;
		const matches = getMatches(val);
		if (matches.length === 1) {
			selectP1(matches[0]);
		} else {
			p1Suggestions = matches;
		}
	}

	function selectP1(p: Player) {
		p1Input = `${p.firstName} ${p.lastName}`;
		p1Id = p.id;
		p1Suggestions = [];
	}

	function onP1Blur() {
		setTimeout(() => { p1Suggestions = []; }, 150);
	}

	// ── Player 2 handlers ─────────────────────────────────────
	function onP2Input(e: Event) {
		const val = (e.currentTarget as HTMLInputElement).value;
		p2Input = val;
		p2Id = null;
		const matches = getMatches(val);
		if (matches.length === 1) {
			selectP2(matches[0]);
		} else {
			p2Suggestions = matches;
		}
	}

	function selectP2(p: Player) {
		p2Input = `${p.firstName} ${p.lastName}`;
		p2Id = p.id;
		p2Suggestions = [];
	}

	function onP2Blur() {
		setTimeout(() => { p2Suggestions = []; }, 150);
	}

	// ── Row click ─────────────────────────────────────────────
	function selectRow(row: PRow) {
		const key = rowKey(row);
		selectedKey = selectedKey === key ? null : key;
		if (selectedKey) {
			p1Input = row.player1Name;
			p1Id = row.player1Id;
			p2Input = row.player2Name;
			p2Id = row.player2Id;
		}
		p1Suggestions = [];
		p2Suggestions = [];
	}

	// ── Derived partnership state ──────────────────────────────
	const pships = $derived(data.partnerships as PRow[]);

	const p1Row = $derived(p1Id
		? pships.find(r => r.player1Id === p1Id || r.player2Id === p1Id) ?? null
		: null);

	const p2Row = $derived(p2Id
		? pships.find(r => r.player1Id === p2Id || r.player2Id === p2Id) ?? null
		: null);

	const areSamePair = $derived(
		!!p1Row && !!p2Row &&
		p1Row.player1Id === p2Row.player1Id &&
		p1Row.tournamentId === p2Row.tournamentId
	);

	const neitherRegistered = $derived(!!p1Id && !!p2Id && !p1Row && !p2Row);

	// Canonical ids for server actions (always player1Id = pair owner)
	const actionP1Id = $derived(areSamePair ? p1Row!.player1Id : p1Id);
	const actionP2Id = $derived(areSamePair ? p1Row!.player2Id : p2Id);

	// Sorted: p1's row floats to top
	const sortedPships = $derived.by(() => {
		if (!p1Id) return pships;
		return [
			...pships.filter(r => r.player1Id === p1Id || r.player2Id === p1Id),
			...pships.filter(r => r.player1Id !== p1Id && r.player2Id !== p1Id)
		];
	});
</script>

<svelte:head>
	<title>Register — {data.tournament.name}</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6">

	<!-- Tournament header -->
	<div class="rounded-lg border p-4">
		<h1 class="text-2xl font-bold">{data.tournament.name}</h1>
		<p class="text-muted-foreground mt-1 text-sm">
			{data.tournament.locationName ?? '—'} · {formatDate(data.tournament.datetime)}
		</p>
	</div>

	{#if form?.error}
		<p class="text-destructive text-sm">{form.error}</p>
	{/if}

	<!-- Player entry row -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end">

		<!-- Player 1 -->
		<div class="relative flex-1">
			<label class="mb-1 block text-sm font-medium" for="p1">Player 1</label>
			<input
				id="p1"
				type="text"
				value={p1Input}
				oninput={onP1Input}
				onblur={onP1Blur}
				placeholder="Name or email…"
				autocomplete="off"
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			{#if p1Suggestions.length > 0}
				<ul class="bg-popover text-popover-foreground absolute z-10 mt-1 w-full rounded-md border shadow-md">
					{#each p1Suggestions as p (p.id)}
						<li>
							<button
								type="button"
								class="hover:bg-accent hover:text-accent-foreground w-full px-3 py-2 text-left text-sm"
								onmousedown={() => selectP1(p)}
							>
								{p.firstName} {p.lastName}
								{#if p.email}<span class="text-muted-foreground ml-1 text-xs">({p.email})</span>{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Player 2 -->
		<div class="relative flex-1">
			<label class="mb-1 block text-sm font-medium" for="p2">Player 2</label>
			<input
				id="p2"
				type="text"
				value={p2Input}
				oninput={onP2Input}
				onblur={onP2Blur}
				placeholder="Name or email…"
				autocomplete="off"
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			{#if p2Suggestions.length > 0}
				<ul class="bg-popover text-popover-foreground absolute z-10 mt-1 w-full rounded-md border shadow-md">
					{#each p2Suggestions as p (p.id)}
						<li>
							<button
								type="button"
								class="hover:bg-accent hover:text-accent-foreground w-full px-3 py-2 text-left text-sm"
								onmousedown={() => selectP2(p)}
							>
								{p.firstName} {p.lastName}
								{#if p.email}<span class="text-muted-foreground ml-1 text-xs">({p.email})</span>{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Action buttons -->
		<div class="flex shrink-0 gap-2">
			{#if areSamePair}
				<form method="POST" action="?/split" use:enhance>
					<input type="hidden" name="player1Id" value={actionP1Id} />
					<input type="hidden" name="player2Id" value={actionP2Id} />
					<input type="hidden" name="tournamentId" value={data.tournament.id} />
					<button type="submit" class="hover:bg-accent rounded-md border px-3 py-2 text-sm font-medium">
						Split
					</button>
				</form>
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="player1Id" value={actionP1Id} />
					<input type="hidden" name="tournamentId" value={data.tournament.id} />
					<button type="submit" class="border-destructive text-destructive hover:bg-destructive/10 rounded-md border px-3 py-2 text-sm font-medium">
						Delete
					</button>
				</form>
			{:else if neitherRegistered}
				<form method="POST" action="?/add" use:enhance>
					<input type="hidden" name="player1Id" value={p1Id} />
					<input type="hidden" name="player2Id" value={p2Id} />
					<button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-2 text-sm font-medium">
						Add
					</button>
				</form>
			{:else if p1Id || p2Id}
				<button
					type="button"
					class="hover:bg-accent rounded-md border px-3 py-2 text-sm font-medium"
					onclick={() => alert('Not yet implemented.')}
				>
					TBD
				</button>
			{/if}
		</div>
	</div>

	<!-- Partnerships table -->
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Player 1</Table.Head>
					<Table.Head>Player 2</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each sortedPships as row (rowKey(row))}
					<Table.Row
						class="cursor-pointer {selectedKey === rowKey(row) ? 'bg-accent' : 'hover:bg-muted/50'}"
						onclick={() => selectRow(row)}
					>
						<Table.Cell>{row.player1Name || '—'}</Table.Cell>
						<Table.Cell>{row.player2Name || '—'}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={2} class="text-muted-foreground h-16 text-center text-sm">
							No registrations yet.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
