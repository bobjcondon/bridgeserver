import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { locations } from '$lib/server/db/schema';
import { requirePermission } from '$lib/server/auth-guard';
import type { Actions } from './$types';

export const load = async ({ locals }: { locals: App.Locals }) => {
	await requirePermission(locals, ['ADMIN', 'DIRECTOR']);
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		await requirePermission(locals, ['ADMIN', 'DIRECTOR']);
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const phone = (data.get('phone') as string)?.trim() || null;
		const address = (data.get('address') as string)?.trim() || null;
		const directions = (data.get('directions') as string)?.trim() || null;

		if (!name) return fail(400, { name, email, phone, address, directions, missing: 'name' });
		if (!email) return fail(400, { name, email, phone, address, directions, missing: 'email' });

		try {
			await db.insert(locations).values({ name, email, phone, address, directions });
		} catch {
			return fail(400, { name, email, phone, address, directions, error: 'Email already in use' });
		}

		redirect(303, '/locations');
	}
};
