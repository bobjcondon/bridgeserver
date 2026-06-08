import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableSortButton from '$lib/components/data-table-sort-button.svelte';
import DataTableActions from './data-table-actions.svelte';

export type TournamentRow = {
	id: string;
	name: string;
	email: string;
	datetime: Date | null;
	locationId: string;
	locationName: string | null;
	closed: boolean;
};

function formatDate(d: Date | null): string {
	if (!d) return '—';
	return new Date(d).toLocaleString();
}

export const columns: ColumnDef<TournamentRow>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Name',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	},
	{
		accessorKey: 'datetime',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Date & Time',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		cell: ({ row }) => formatDate(row.getValue('datetime')),
		enableGlobalFilter: false
	},
	{
		accessorKey: 'locationName',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Location',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	},
	{
		id: 'actions',
		header: 'Actions',
		enableSorting: false,
		enableGlobalFilter: false,
		cell: ({ row }) => renderComponent(DataTableActions, { tournament: row.original })
	}
];
