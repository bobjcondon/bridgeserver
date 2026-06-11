import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// src/lib/server/db/schema.ts
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { user } from './auth.schema.js';

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
};

// Optional 1-1 relation to user.
// Every user has a player but not all players are registered users.
export const players = sqliteTable('players', {
  id: text('id').primaryKey().$defaultFn(() => nanoid(15)),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  // Privacy preferences (all opt-in, default false)
	shareEmail: integer('share_email', { mode: 'boolean' }).notNull().default(false),
	sharePhone: integer('share_phone', { mode: 'boolean' }).notNull().default(false),
	clubEmail: integer('club_email', { mode: 'boolean' }).notNull().default(false),
  // nullable() makes the relationship optional (1-to-0/1)
  userId: integer('user_id').references(() => user.id).unique(), 
  ...timestamps
});

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey().$defaultFn(() => nanoid(15)),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  directions: text('directions'),
  ...timestamps
});


export const tournaments = sqliteTable('tournaments', {
  id: text('id').primaryKey().$defaultFn(() => nanoid(15)),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  datetime: integer('datetime', { mode: 'timestamp' }),
  closed: integer('closed', { mode: 'boolean' }).notNull().default(false),
  results: text('results'),  // TODO make own class
  locationId: text('location_id').notNull().references(() => locations.id),
  ...timestamps
});


export const partnerships = sqliteTable('partnerships', {
  player1Id: text('player1_id').notNull().references(() => players.id),
  player2Id: text('player2_id').references(() => players.id),
  tournamentId: text('tournament_id').notNull().references(() => tournaments.id),
  ...timestamps
});



export * from './auth.schema';
