import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// src/lib/server/db/schema.ts
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
};

export const players = sqliteTable('players', {
  id: text('id').primaryKey().$defaultFn(() => nanoid(15)),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
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
  locationId: text('location_id')
	.notNull()
	.references(() => locations.id),
  ...timestamps
});


export const partnerships = sqliteTable('partnerships', {
  player1Id: text('player1_id').references(() => players.id),
  player2Id: text('player2_id').references(() => players.id),
  tournamentId: text('tournament_id').references(() => tournaments.id),
  ...timestamps
});

export * from './auth.schema';
