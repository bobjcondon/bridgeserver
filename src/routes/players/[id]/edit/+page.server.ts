import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { players } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const player = await db.query.players.findFirst({ where: eq(players.id, params.id) });

	if (!player) error(404, 'Player not found');

	return { player };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const firstName = (data.get('firstName') as string)?.trim();
		const lastName = (data.get('lastName') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const phone = (data.get('phone') as string)?.trim() || null;

		if (!firstName) return fail(400, { firstName, lastName, email, phone, missing: 'firstName' });
		if (!lastName) return fail(400, { firstName, lastName, email, phone, missing: 'lastName' });
		if (!email) return fail(400, { firstName, lastName, email, phone, missing: 'email' });

		try {
			await db
				.update(players)
				.set({ firstName, lastName, email, phone, updatedAt: new Date() })
				.where(eq(players.id, params.id));
		} catch {
			return fail(400, { firstName, lastName, email, phone, error: 'Email already in use' });
		}

		redirect(303, `/players/${params.id}`);
	}
};
