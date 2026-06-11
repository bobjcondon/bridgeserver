<script lang="ts">
	import { enhance } from '$app/forms';
	import DataTable from '$lib/components/data-table.svelte';
	import PlayerInput from '$lib/components/PlayerInput.svelte';
	import { columns } from './columns.js';

	type Player = { id: string; firstName: string; lastName: string; email: string | null };
	type PRow = {
		player1Id: string | null;
		player1Name: string;
		player2Id: string | null;
		player2Name: string;
		tournamentId: string | null;
	};

	let { data, form } = $props();

	function formatDate(d: Date | null) {
		if (!d) return '—';
		return new Date(d).toLocaleString();
	}

	// ── SR state ──────────────────────────────────────────────────
	// SR.new: true = creating new; false = editing an existing registration
	let srNew = $state(true);
	let srP1Id = $state<string | null>(null);  // stored registration's player1
	let srP2Id = $state<string | null>(null);  // stored registration's player2

	// ── Current P1 / P2 input selections ─────────────────────────
	let p1Id = $state<string | null>(null);
	let p2Id = $state<string | null>(null);

	// Keys + initial values to drive PlayerInput remounts
	let p1Key = $state(0);
	let p2Key = $state(0);
	let p1Init = $state('');
	let p2Init = $state('');

	// ── Selected table row ────────────────────────────────────────
	let selectedKey = $state<string | null>(null);

	function rowKey(r: PRow) {
		return `${r.player1Id}:${r.tournamentId}`;
	}

	// ── Button conditions ─────────────────────────────────────────
	const addEnabled    = $derived(srNew && !!p1Id);
	const clearEnabled  = $derived(!srNew);
	const deleteEnabled = $derived(!srNew && p1Id === srP1Id && p2Id === srP2Id);
	const splitEnabled  = $derived(!srNew && p1Id === srP1Id && p2Id === srP2Id && !!srP2Id);

	// ── Actions ───────────────────────────────────────────────────
	function resetAll() {
		srNew = true;
		srP1Id = null;
		srP2Id = null;
		p1Id = null;
		p2Id = null;
		p1Init = '';
		p2Init = '';
		p1Key++;
		p2Key++;
		selectedKey = null;
	}

	function onClear() {
		resetAll();
	}

	function onRowClick(row: PRow) {
		const key = rowKey(row);
		if (selectedKey === key) {
			resetAll();
			return;
		}
		selectedKey = key;
		srNew = false;
		srP1Id = row.player1Id;
		srP2Id = row.player2Id;
		p1Id = row.player1Id;
		p2Id = row.player2Id;
		p1Init = row.player1Name;
		p2Init = row.player2Name;
		p1Key++;
		p2Key++;
	}

	const pships = $derived(data.partnerships as PRow[]);
	const formError = $derived((form as { error?: string } | null)?.error ?? null);
</script>

<svelte:head>
	<title>Register — {data.tournament.name}</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-8">

	<!-- Header -->
	<div class="rounded-lg border p-4">
		<h1 class="text-2xl font-bold">{data.tournament.name}</h1>
		<p class="text-muted-foreground mt-1 text-sm">
			{data.tournament.locationName ?? '—'} · {formatDate(data.tournament.datetime)}
		</p>
	</div>

	<!-- Select-Registration -->
	<section class="space-y-4">
		{#if formError}
			<p class="text-destructive text-sm">{formError}</p>
		{/if}

		<!-- P1 and P2 inputs -->
		<div class="flex flex-col gap-4 sm:flex-row">
			<div class="flex-1">
				<label class="mb-1 block text-sm font-medium" for="p1">Player 1</label>
				{#key p1Key}
					<PlayerInput
						players={data.players as Player[]}
						id="p1"
						initialValue={p1Init}
						onchange={(id) => (p1Id = id)}
					/>
				{/key}
			</div>
			<div class="flex-1">
				<label class="mb-1 block text-sm font-medium" for="p2">Player 2</label>
				{#key p2Key}
					<PlayerInput
						players={data.players as Player[]}
						id="p2"
						initialValue={p2Init}
						onchange={(id) => (p2Id = id)}
					/>
				{/key}
			</div>
		</div>

		<!-- Action buttons -->
		<div class="flex flex-wrap gap-2">
			<!-- ADD -->
			<form
				method="POST"
				action="?/add"
				use:enhance={() => async ({ result, update }) => {
					await update();
					if (result.type === 'success') resetAll();
				}}
			>
				<input type="hidden" name="player1Id" value={p1Id} />
				<input type="hidden" name="player2Id" value={p2Id} />
				<button
					type="submit"
					disabled={!addEnabled}
					class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
				>
					ADD
				</button>
			</form>

			<!-- CLEAR -->
			<button
				type="button"
				disabled={!clearEnabled}
				onclick={onClear}
				class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
			>
				CLEAR
			</button>

			<!-- DELETE -->
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => async ({ result, update }) => {
					await update();
					if (result.type === 'success') resetAll();
				}}
			>
				<input type="hidden" name="player1Id" value={srP1Id} />
				<input type="hidden" name="tournamentId" value={data.tournament.id} />
				<button
					type="submit"
					disabled={!deleteEnabled}
					class="border-destructive text-destructive hover:bg-destructive/10 rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
				>
					DELETE
				</button>
			</form>

			<!-- SPLIT -->
			<form
				method="POST"
				action="?/split"
				use:enhance={() => async ({ result, update }) => {
					await update();
					if (result.type === 'success') resetAll();
				}}
			>
				<input type="hidden" name="player1Id" value={srP1Id} />
				<input type="hidden" name="player2Id" value={srP2Id} />
				<input type="hidden" name="tournamentId" value={data.tournament.id} />
				<button
					type="submit"
					disabled={!splitEnabled}
					class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
				>
					SPLIT
				</button>
			</form>
		</div>
	</section>

	<!-- Partnerships table -->
	<DataTable
		data={pships}
		{columns}
		rowLabel="partnership"
		searchPlaceholder="Search by player name..."
		onRowClick={onRowClick}
		isRowSelected={(row) => selectedKey === rowKey(row as PRow)}
	/>

</div>
