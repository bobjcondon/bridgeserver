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
	delete: async ({ params }) => {
		await db.delete(players).where(eq(players.id, params.id));
		redirect(303, '/players');
	}
};
