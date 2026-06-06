import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { players } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstName = (data.get('firstName') as string)?.trim();
		const lastName = (data.get('lastName') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const phone = (data.get('phone') as string)?.trim() || null;

		if (!firstName) return fail(400, { firstName, lastName, email, phone, missing: 'firstName' });
		if (!lastName) return fail(400, { firstName, lastName, email, phone, missing: 'lastName' });
		if (!email) return fail(400, { firstName, lastName, email, phone, missing: 'email' });

		try {
			await db.insert(players).values({ firstName, lastName, email, phone });
		} catch {
			return fail(400, { firstName, lastName, email, phone, error: 'Email already in use' });
		}

		redirect(303, '/players');
	}
};
