---
name: svelte5-development
description: Comprehensive Svelte 5 and SvelteKit development guidance. Use this skill when building Svelte components, working with runes, or developing SvelteKit applications. Covers reactive patterns, component architecture, routing, and data loading.
---

This skill provides guidance for Svelte 5 and SvelteKit development, covering runes, component patterns, routing, and common pitfalls.

## Svelte 5 Runes - Core Reactivity

### $state - Reactive State
Creates reactive state that updates the UI when changed.

```svelte
<script>
	let count = $state(0);
	let user = $state({ name: 'Alice', age: 30 });
</script>

<button onclick={() => count++}>Clicks: {count}</button>
<button onclick={() => user.age++}>Age: {user.age}</button>
```

**Deep Reactivity**: Objects and arrays become deeply reactive proxies. Mutations trigger updates:
```js
let todos = $state([{ done: false, text: 'learn svelte' }]);
todos[0].done = true; // triggers update
todos.push({ done: false, text: 'build app' }); // triggers update
```

**$state.raw**: Use for non-reactive objects (performance optimization):
```js
let data = $state.raw({ large: 'dataset' });
data = { large: 'new value' }; // must reassign entire object
```

### $derived - Computed Values

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

**For complex logic, use $derived.by**:
```js
let total = $derived.by(() => {
	let sum = 0;
	for (const n of numbers) sum += n;
	return sum;
});
```

**Critical Rule**: NEVER update state inside $derived — it must be side-effect free.

### $effect - Side Effects

```svelte
<script>
	let size = $state(50);
	let canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, size, size);
		return () => {}; // optional cleanup
	});
</script>
```

**CRITICAL — When NOT to use $effect**:
- ❌ Don't synchronize state (use $derived instead)
- ✅ DO use for: canvas drawing, third-party libs, analytics, intervals, DOM manipulation

### $props - Component Props

```svelte
<!-- Child.svelte -->
<script lang="ts">
	interface Props { message: string; count?: number; }
	let { message, count = 0 }: Props = $props();
</script>
```

### $bindable - Two-Way Binding

```svelte
<!-- FancyInput.svelte -->
<script>
	let { value = $bindable(), ...props } = $props();
</script>
<input bind:value {...props} />
```

## Common Patterns and Pitfalls

```svelte
<script>
	let a = $state(1);
	let b = $state(2);

	// ✅ GOOD — computed value
	let sum = $derived(a + b);

	// ❌ BAD — don't use $effect for computed values
	let sum2 = $state(0);
	$effect(() => { sum2 = a + b; }); // WRONG
</script>
```

## SvelteKit Routing

**File types:**
- `+page.svelte` — page component
- `+page.ts` — universal load (runs server + client)
- `+page.server.ts` — server-only load (DB, secrets)
- `+layout.svelte` — layout wrapper
- `+error.svelte` — error boundary
- `+server.ts` — API endpoint

**Dynamic routes:** `[slug]` · `[...rest]` · `[[optional]]`

## Loading Data

```ts
// +page.server.ts
export const load = async ({ locals }) => {
	const user = await db.users.get(locals.userId);
	return { user }; // must be JSON-serializable
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
	let { data } = $props();
</script>
<h1>{data.user.name}</h1>
```

## Form Actions

```ts
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		if (!email) return fail(400, { missing: true });
		await updateEmail(email);
		throw redirect(303, '/success');
	}
};
```

## Environment Variables

```ts
import { DATABASE_URL } from '$env/static/private';    // server-only
import { PUBLIC_APP_NAME } from '$env/static/public';  // exposed to client
```

## Snippets and Render

```svelte
{#snippet listItem(item)}
	<li>{item.name}</li>
{/snippet}

{#each items as item}
	{@render listItem(item)}
{/each}
```

## Best Practices

1. Use `$derived`, not `$effect`, for computed values
2. Don't mutate props — use callbacks or `$bindable`
3. Always key `{#each}` blocks: `{#each items as item (item.id)}`
4. Prefer server load for sensitive data / DB access
5. Return only serializable data from server load functions

**Source:** [splinesreticulating/claude-svelte5-skill](https://github.com/splinesreticulating/claude-svelte5-skill)
