import { error, fail } from '@sveltejs/kit';
import { eq, and, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '$lib/server/db';
import { tournaments, locations, players, partnerships } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

const p1Table = alias(players, 'p1');
const p2Table = alias(players, 'p2');

export const load: PageServerLoad = async ({ params }) => {
	const [tournament] = await db
		.select({
			id: tournaments.id,
			name: tournaments.name,
			datetime: tournaments.datetime,
			closed: tournaments.closed,
			locationName: locations.name
		})
		.from(tournaments)
		.leftJoin(locations, eq(tournaments.locationId, locations.id))
		.where(eq(tournaments.id, params.id));

	if (!tournament) error(404, 'Tournament not found');

	const allPlayers = await db
		.select({ id: players.id, firstName: players.firstName, lastName: players.lastName, email: players.email })
		.from(players)
		.orderBy(players.lastName, players.firstName);

	const pships = await db
		.select({
			player1Id: partnerships.player1Id,
			player1Name: sql<string>`coalesce(${p1Table.firstName} || ' ' || ${p1Table.lastName}, '')`,
			player2Id: partnerships.player2Id,
			player2Name: sql<string>`coalesce(${p2Table.firstName} || ' ' || ${p2Table.lastName}, '')`,
			tournamentId: partnerships.tournamentId
		})
		.from(partnerships)
		.leftJoin(p1Table, eq(partnerships.player1Id, p1Table.id))
		.leftJoin(p2Table, eq(partnerships.player2Id, p2Table.id))
		.where(eq(partnerships.tournamentId, params.id));

	return { tournament, players: allPlayers, partnerships: pships };
};

export const actions: Actions = {
	add: async ({ request, params }) => {
		const data = await request.formData();
		const player1Id = data.get('player1Id') as string | null;
		const player2Id = data.get('player2Id') as string | null;
		if (!player1Id) return fail(400, { error: 'Player 1 is required' });
		try {
			await db.insert(partnerships).values({ player1Id, player2Id: player2Id || null, tournamentId: params.id });
		} catch {
			return fail(400, { error: 'Could not add — player may already be registered' });
		}
		return { success: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const player1Id = data.get('player1Id') as string | null;
		const tournamentId = data.get('tournamentId') as string | null;
		if (!player1Id || !tournamentId) return fail(400, { error: 'Missing data' });
		await db.delete(partnerships).where(
			and(eq(partnerships.player1Id, player1Id), eq(partnerships.tournamentId, tournamentId))
		);
		return { success: true };
	},

	split: async ({ request }) => {
		const data = await request.formData();
		const player1Id = data.get('player1Id') as string | null;
		const player2Id = data.get('player2Id') as string | null;
		const tournamentId = data.get('tournamentId') as string | null;
		if (!player1Id || !player2Id || !tournamentId) return fail(400, { error: 'Missing data' });
		await db.update(partnerships)
			.set({ player2Id: null })
			.where(and(eq(partnerships.player1Id, player1Id), eq(partnerships.tournamentId, tournamentId)));
		try {
			await db.insert(partnerships).values({ player1Id: player2Id, player2Id: null, tournamentId });
		} catch { /* player2 already has a solo entry */ }
		return { success: true };
	}
};
