import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tournaments, locations } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		locations: await db.select().from(locations).orderBy(locations.name)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const locationId = (data.get('locationId') as string)?.trim();
		const datetimeRaw = (data.get('datetime') as string)?.trim() || null;
		const datetime = datetimeRaw ? new Date(datetimeRaw) : null;

		if (!name) return fail(400, { name, email, locationId, datetimeRaw, missing: 'name' });
		if (!email) return fail(400, { name, email, locationId, datetimeRaw, missing: 'email' });
		if (!locationId) return fail(400, { name, email, locationId, datetimeRaw, missing: 'locationId' });

		try {
			await db.insert(tournaments).values({ name, email, locationId, datetime });
		} catch {
			return fail(400, { name, email, locationId, datetimeRaw, error: 'Email already in use' });
		}

		redirect(303, '/tournaments');
	}
};
