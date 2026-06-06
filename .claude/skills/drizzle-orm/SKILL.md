---
name: drizzle-orm
description: Drizzle ORM patterns and migration safety rules. Use when defining schemas, running migrations, or debugging database issues. Triggers on: Drizzle, schema, migration, db:push, $inferSelect, array column, relations.
---

# Drizzle ORM Pitfalls & Patterns

Common pitfalls and correct patterns for Drizzle ORM with SQLite/libsql.

## Critical Rules

```typescript
// ❌ NEVER change primary key types in production
// serial → varchar or varchar → uuid BREAKS migrations

// ✅ Array columns — correct syntax
allowedTokens: text('allowed_tokens').array()  // CORRECT
// ❌ WRONG: array(text('allowed_tokens'))

// ✅ Always export inferred types
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
```

## Schema Patterns for This Project

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull().$defaultFn(() => new Date()),
};

export const players = sqliteTable('players', {
  id: text('id').primaryKey().$defaultFn(() => nanoid(15)),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  ...timestamps,
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
```

## Querying Patterns

```typescript
import { eq, and, or, like, desc, asc } from 'drizzle-orm';

// Select with where
const player = await db.query.players.findFirst({
  where: eq(players.email, email),
});

// Select many with relations
const allPlayers = await db.query.players.findMany({
  orderBy: [asc(players.lastName), asc(players.firstName)],
});

// Insert returning
const [newPlayer] = await db.insert(players)
  .values({ firstName: 'Alice', lastName: 'Walker', email: 'alice@example.com' })
  .returning();

// Update
await db.update(players)
  .set({ phone: '555-0001', updatedAt: new Date() })
  .where(eq(players.id, id));

// Delete
await db.delete(players).where(eq(players.id, id));
```

## Relations

```typescript
import { relations } from 'drizzle-orm';

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  location: one(locations, {
    fields: [tournaments.locationId],
    references: [locations.id],
  }),
  partnerships: many(partnerships),
}));
```

## Migration Safety

```bash
# Dev: sync schema (safe)
bun run db:push

# Generate SQL migration files (for production)
bun run db:generate
bun run db:migrate

# NEVER force-push with data-loss warnings in production without a backup
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  const [loc] = await tx.insert(locations).values(locData).returning();
  await tx.insert(tournaments).values({ ...tData, locationId: loc.id });
});
```

## Quick Checklist

- [ ] No primary key type changes in existing tables
- [ ] Array columns use `.array()` chained syntax
- [ ] `$inferSelect` / `$inferInsert` types exported for all tables
- [ ] `updatedAt` set manually on update (SQLite has no `$onUpdate` trigger)
- [ ] Migrations tested in dev before prod

**Source:** [BarisSozen/claude](https://github.com/BarisSozen/claude/blob/main/.claude/skills/pitfalls-drizzle-orm/SKILL.md)
