---
name: sveltekit-data-flow
description: SvelteKit data flow guidance. Use for load functions, form actions, and server/client data. Covers +page.server.ts vs +page.ts, serialization, fail(), redirect(), error().
---

# SvelteKit Data Flow

## Quick Start

**Which file?** Server-only (DB/secrets): `+page.server.ts` | Universal (runs both): `+page.ts` | API: `+server.ts`

**Load decision:** Need server resources? → server load | Need client APIs? → universal load

**Form actions:** Always `+page.server.ts`. Return `fail()` for errors, throw `redirect()` to navigate, throw `error()` for failures.

## Example

```typescript
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = await db.users.get(locals.userId);
	return { user }; // Must be JSON-serializable
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');

		if (!email) return fail(400, { email, missing: true });

		await updateEmail(email);
		throw redirect(303, '/success');
	},
};
```

## Key Rules

- Server load → universal load via `data` param
- ALWAYS `throw redirect()` / `throw error()` — do NOT return them
- No class instances/functions from server load (not serializable)
- `fail()` returns to the page; `redirect()` navigates; `error()` shows error page

## Type Safety

```typescript
// +page.server.ts
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => { ... };
export const actions: Actions = { ... };
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>
```

**Source:** [spences10/svelte-claude-skills](https://github.com/spences10/svelte-claude-skills)
