import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { tournaments, locations } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [row] = await db
		.select({
			id: tournaments.id,
			name: tournaments.name,
			email: tournaments.email,
			datetime: tournaments.datetime,
			locationId: tournaments.locationId,
			locationName: locations.name,
			createdAt: tournaments.createdAt,
			updatedAt: tournaments.updatedAt
		})
		.from(tournaments)
		.leftJoin(locations, eq(tournaments.locationId, locations.id))
		.where(eq(tournaments.id, params.id))
		.limit(1);

	if (!row) error(404, 'Tournament not found');

	return { tournament: row };
};

export const actions: Actions = {
	delete: async ({ params }) => {
		await db.delete(tournaments).where(eq(tournaments.id, params.id));
		redirect(303, '/tournaments');
	}
};
