import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableSortButton from '$lib/components/data-table-sort-button.svelte';

export type PartnershipRow = {
	player1Id: string | null;
	player1Name: string;
	player2Id: string | null;
	player2Name: string;
	tournamentId: string | null;
};

export const columns: ColumnDef<PartnershipRow>[] = [
	{
		accessorKey: 'player1Name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Player 1',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	},
	{
		accessorKey: 'player2Name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Player 2',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	}
];
