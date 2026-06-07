<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Login</h1>
<form method="post" action="?/signInEmail" use:enhance class="flex flex-col gap-4">
	<label class="flex flex-col gap-1">
		Email
		<input
			type="email"
			name="email"
			class="rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<label class="flex flex-col gap-1">
		Password
		<input
			type="password"
			name="password"
			class="rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<label class="flex flex-col gap-1">
		Name (for registration)
		<input
			name="name"
			class="rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<div class="flex gap-2">
		<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>Login</button
		>
		<button
			formaction="?/signUpEmail"
			class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>Register</button
		>
	</div>
</form>
<p class="text-red-500">{form?.message ?? ''}</p>

<hr class="my-4" />

<form method="post" action="?/signInSocial" use:enhance>
	<input type="hidden" name="provider" value="github" />
	<input type="hidden" name="callbackURL" value="/better-auth" />
	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Sign in with GitHub</button
	>
</form>
