import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { tournaments, locations } from '$lib/server/db/schema';
import { requirePermission } from '$lib/server/auth-guard';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	await requirePermission(locals, ['ADMIN', 'DIRECTOR']);
	const tournament = await db.query.tournaments.findFirst({
		where: eq(tournaments.id, params.id)
	});

	if (!tournament) error(404, 'Tournament not found');

	const allLocations = await db.select().from(locations).orderBy(locations.name);

	return { tournament, locations: allLocations };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		await requirePermission(locals, ['ADMIN', 'DIRECTOR']);
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
			await db
				.update(tournaments)
				.set({ name, email, locationId, datetime, updatedAt: new Date() })
				.where(eq(tournaments.id, params.id));
		} catch {
			return fail(400, { name, email, locationId, datetimeRaw, error: 'Email already in use' });
		}

		redirect(303, `/tournaments/${params.id}`);
	}
};
