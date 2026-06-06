import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import type { players } from '$lib/server/db/schema';
import DataTableSortButton from './data-table-sort-button.svelte';
import DataTableActions from './data-table-actions.svelte';

export type Player = typeof players.$inferSelect;

export const columns: ColumnDef<Player>[] = [
	{
		accessorKey: 'lastName',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Last Name',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	},
	{
		accessorKey: 'firstName',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'First Name',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	},
	{
		accessorKey: 'email',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Email',
				sorted: column.getIsSorted(),
				onclick: column.getToggleSortingHandler()
			}),
		enableGlobalFilter: true
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
		enableSorting: false,
		enableGlobalFilter: false
	},
	{
		id: 'actions',
		header: 'Actions',
		enableSorting: false,
		enableGlobalFilter: false,
		cell: ({ row }) => renderComponent(DataTableActions, { player: row.original })
	}
];
