import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import type { locations } from '$lib/server/db/schema';
import DataTableSortButton from '$lib/components/data-table-sort-button.svelte';
import DataTableActions from './data-table-actions.svelte';

export type Location = typeof locations.$inferSelect;

export const columns: ColumnDef<Location>[] = [
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
		accessorKey: 'address',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				label: 'Address',
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
		cell: ({ row }) => renderComponent(DataTableActions, { location: row.original })
	}
];
