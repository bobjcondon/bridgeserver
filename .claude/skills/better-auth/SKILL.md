---
name: better-auth
description: Implement authentication with Better Auth in SvelteKit. Use when adding auth, OAuth providers, sessions, protected routes, or user management. Covers email/password, GitHub OAuth, session management, and SvelteKit hooks integration.
license: MIT
version: 2.0.0
---

# Better Auth — SvelteKit Integration

Better Auth is a framework-agnostic TypeScript authentication framework. This project already has it configured.

## Existing Setup (this project)

```
src/lib/server/auth.ts      — server auth instance
src/lib/server/db/auth.schema.ts  — generated DB schema
src/hooks.server.ts         — mounts auth handler
```

Environment variables required:
```env
BETTER_AUTH_SECRET=<32+ char secret>
BETTER_AUTH_URL=http://localhost:5173
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Server Auth Instance Pattern

```typescript
// src/lib/server/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite', schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

## SvelteKit Hook

```typescript
// src/hooks.server.ts
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle = svelteKitHandler({ auth });
```

To add custom logic (e.g. attaching session to locals), wrap with sequence:

```typescript
import { sequence } from '@sveltejs/kit/hooks';

const authHandler = svelteKitHandler({ auth });

const sessionHandler: Handle = async ({ event, resolve }) => {
  event.locals.session = await auth.api.getSession({
    headers: event.request.headers,
  });
  return resolve(event);
};

export const handle = sequence(authHandler, sessionHandler);
```

## Client Auth

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5173',
});
```

```svelte
<script>
  import { authClient } from '$lib/auth-client';

  async function signIn() {
    await authClient.signIn.email({ email, password });
  }

  async function signInGitHub() {
    await authClient.signIn.social({ provider: 'github' });
  }

  async function signOut() {
    await authClient.signOut();
  }

  // Reactive session
  const session = authClient.useSession();
</script>

{#if $session.data}
  <p>Hello {$session.data.user.name}</p>
  <button onclick={signOut}>Sign out</button>
{:else}
  <button onclick={signIn}>Sign in</button>
{/if}
```

## Protecting Routes (server-side)

```typescript
// +page.server.ts
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(302, '/login');
  return { user: session.user };
};
```

## Schema Regeneration

After adding plugins, regenerate the auth schema:
```bash
bun run auth:schema
bun run db:push
```

## Implementation Checklist

- [ ] `BETTER_AUTH_SECRET` is 32+ characters
- [ ] API handler mounted in `hooks.server.ts`
- [ ] Client instance created with correct `baseURL`
- [ ] Protected routes check session server-side
- [ ] After adding plugins: regenerate schema → push migrations

**Sources:** [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) · [better-auth.com/docs](https://www.better-auth.com/docs)
