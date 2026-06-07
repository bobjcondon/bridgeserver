import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { nanoid } from 'nanoid';
import { players, locations, tournaments, user } from '../src/lib/server/db/schema.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const client = createClient({ url });
const db = drizzle(client);

const seedLocations = [
  {
    id: nanoid(15),
    name: 'Eastside Bridge Club',
    email: 'info@eastsidebridge.com',
    phone: '555-100-0001',
    address: '123 Main St, Seattle, WA 98101',
    directions: 'Enter from the south parking lot.',
  },
  {
    id: nanoid(15),
    name: 'Westlake Community Center',
    email: 'events@westlakecc.com',
    phone: '555-100-0002',
    address: '456 Lake Ave, Seattle, WA 98109',
    directions: 'Follow signs to the banquet hall.',
  },
];

// 5 users (with matching players) + 5 extra players = 10 total
const userData = [
  { email: 'bobjcondon@gmail.com',   firstName: 'Bob',   lastName: 'Condon', phone: '555-100-0001', role: 'ADMIN' },
];

const extraPlayers = [
  { firstName: 'Frank',  lastName: 'Brown',    email: 'frank@example.com',  phone: '555-200-0006' },
  { firstName: 'Grace',  lastName: 'Lee',      email: 'grace@example.com',  phone: '555-200-0007' },
  { firstName: 'Henry',  lastName: 'Wilson',   email: 'henry@example.com',  phone: '555-200-0008' },
  { firstName: 'Irene',  lastName: 'Taylor',   email: 'irene@example.com',  phone: '555-200-0009' },
  { firstName: 'James',  lastName: 'Anderson', email: 'james@example.com',  phone: '555-200-0010' },
];

async function seed() {
  console.log('Seeding locations...');
  await db.insert(locations).values(seedLocations).onConflictDoNothing();

  console.log('Seeding users and matching players...');
  for (const u of userData) {
    const [existingUser] = await db.insert(user).values({
      id: nanoid(15),
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: u.role,
    }).onConflictDoNothing().returning({ id: user.id });

    await db.insert(players).values({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: `555-100-${String(userData.indexOf(u) + 1).padStart(4, '0')}`,
      userId: existingUser ? existingUser.id : undefined,
    }).onConflictDoNothing();
  }

  console.log('Seeding extra players...');
  await db.insert(players).values(extraPlayers).onConflictDoNothing();

  console.log('Seeding tournaments...');
  await db.insert(tournaments).values([
    {
      name: 'Spring Pairs 2026',
      email: 'spring2026@bridgeserver.com',
      datetime: new Date('2026-04-15T13:00:00Z'),
      locationId: seedLocations[0].id,
    },
    {
      name: 'Summer Swiss 2026',
      email: 'summer2026@bridgeserver.com',
      datetime: new Date('2026-07-20T10:00:00Z'),
      locationId: seedLocations[1].id,
    },
  ]).onConflictDoNothing();

  console.log('Done seeding.');
  client.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
