import { redirect, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';

type Permission = 'ADMIN' | 'DIRECTOR' | 'PLAYER';

// Redirects to login if not authenticated; throws 403 if role not in allowed list.
export async function requirePermission(locals: App.Locals, allowed: Permission[]) {
	if (!locals.user) {
		redirect(303, '/better-auth/login');
	}

	const [dbUser] = await db
		.select({ role: userTable.role })
		.from(userTable)
		.where(eq(userTable.id, locals.user.id));

	if (!dbUser || !allowed.includes(dbUser.role as Permission)) {
		error(403, 'Access denied');
	}
}
