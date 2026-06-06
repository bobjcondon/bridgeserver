import { error, fail, redirect } from '@sveltejs/kit';
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
	default: async ({ request, params }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const phone = (data.get('phone') as string)?.trim() || null;
		const address = (data.get('address') as string)?.trim() || null;
		const directions = (data.get('directions') as string)?.trim() || null;

		if (!name) return fail(400, { name, email, phone, address, directions, missing: 'name' });
		if (!email) return fail(400, { name, email, phone, address, directions, missing: 'email' });

		try {
			await db
				.update(locations)
				.set({ name, email, phone, address, directions, updatedAt: new Date() })
				.where(eq(locations.id, params.id));
		} catch {
			return fail(400, { name, email, phone, address, directions, error: 'Email already in use' });
		}

		redirect(303, `/locations/${params.id}`);
	}
};
