import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { tournaments, locations } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db
		.select({
			id: tournaments.id,
			name: tournaments.name,
			email: tournaments.email,
			datetime: tournaments.datetime,
			locationId: tournaments.locationId,
			locationName: locations.name
		})
		.from(tournaments)
		.leftJoin(locations, eq(tournaments.locationId, locations.id))
		.orderBy(tournaments.datetime);

	return { tournaments: rows };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { message: 'Missing tournament id' });
		}

		await db.delete(tournaments).where(eq(tournaments.id, id));
		return { success: true };
	}
};
