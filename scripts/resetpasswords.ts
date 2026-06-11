import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import { user, account } from '../src/lib/server/db/schema.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const client = createClient({ url });
const db = drizzle(client);

// Edit this list to set passwords and roles for specific users.
// : 'ADMIN' | 'DIRECTOR' | 'PLAYER'
const updates: { email: string; password: string; role: 'ADMIN' | 'DIRECTOR' | 'PLAYER' }[] = [
  { email: 'bobjcondon@gmail.com',   password: '7NoTrump', role: 'DIRECTOR' },
];

async function resetPasswords() {
  for (const entry of updates) {
    const [foundUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, entry.email));

    if (!foundUser) {
      console.warn(`  SKIP  ${entry.email} — user not found`);
      continue;
    }

    // Update role on the user record
    await db
      .update(user)
      .set({ role: entry.role })
      .where(eq(user.id, foundUser.id));

    // Hash and update the credential account password
    const hashed = await hashPassword(entry.password);
    const result = await db
      .update(account)
      .set({ password: hashed })
      .where(and(eq(account.userId, foundUser.id), eq(account.providerId, 'credential')));

    if (result.rowsAffected === 0) {
      console.warn(`  WARN  ${entry.email} — no credential account found (may use OAuth only)`);
    } else {
      console.log(`  OK    ${entry.email} — password reset, role set to ${entry.role}`);
    }
  }

  console.log('Done.');
  client.close();
}

resetPasswords().catch((err) => {
  console.error(err);
  process.exit(1);
});
