---
name: sveltekit-structure
description: SvelteKit structure guidance. Use for routing, layouts, error handling, SSR, or svelte:boundary. Covers file naming, nested layouts, error boundaries, pending UI, and hydration.
---

# SvelteKit Structure

## Quick Start

**File types:** `+page.svelte` (page) | `+layout.svelte` (wrapper) | `+error.svelte` (error boundary) | `+server.ts` (API endpoint)

**Routes:** `src/routes/about/+page.svelte` → `/about` | `src/routes/posts/[id]/+page.svelte` → `/posts/123`

**Layouts:** Apply to all child routes. `+layout.svelte` at any level wraps descendants.

## Route Tree Example

```
src/routes/
├── +layout.svelte              # Root layout (all pages)
├── +page.svelte                # /
├── about/+page.svelte          # /about
└── dashboard/
    ├── +layout.svelte          # Dashboard layout
    ├── +page.svelte            # /dashboard
    └── settings/+page.svelte   # /dashboard/settings
```

```svelte
<!-- +layout.svelte -->
<script>
	let { children } = $props();
</script>

<nav><!-- Navigation --></nav>
<main>{@render children()}</main>
<footer><!-- Footer --></footer>
```

## Route Groups

Wrap folder name in `(parentheses)` to group routes without affecting the URL:

```
src/routes/
├── (auth)/
│   ├── login/+page.svelte      # /login
│   └── register/+page.svelte  # /register
└── (app)/
    ├── +layout.svelte          # Only wraps (app) routes
    └── dashboard/+page.svelte  # /dashboard
```

## Error Handling

```svelte
<!-- +error.svelte -->
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error?.message}</h1>
```

Place `+error.svelte` at the level of the failing route or above.

## Hooks (src/hooks.server.ts)

```typescript
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Protect routes, attach locals
	const session = await getSession(event.cookies);
	event.locals.user = session?.user ?? null;
	return resolve(event);
};
```

## Key Rules

- Layouts: use `{@render children()}` (Svelte 5)
- `+error.svelte` must be placed ABOVE the failing route
- `(group)` folders don't appear in URLs
- Browser-only code: guard with `if (browser)` from `$app/environment`
- Client-only modules: use `$app/environment` check, not `typeof window`

**Source:** [spences10/svelte-claude-skills](https://github.com/spences10/svelte-claude-skills)
