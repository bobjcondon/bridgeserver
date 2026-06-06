import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { locations } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const location = await db.query.locations.findFirst({ where: eq(locations.id, params.id) });

	if (!location) error(404, 'Location not found');

	return { location };
};

export const actions: Actions = {
	delete: async ({ params }) => {
		await db.delete(locations).where(eq(locations.id, params.id));
		redirect(303, '/locations');
	}
};
