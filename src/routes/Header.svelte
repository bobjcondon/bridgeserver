<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import github from '$lib/images/github.svg';
	import logo from '$lib/images/svelte-logo.svg';
</script>

<header>
	<div class="corner">
		<a href="https://svelte.dev/docs/kit">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href={resolve('/about')}>About</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/players') ? 'page' : undefined}>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="nav-trigger">Players</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item href="/players">All</DropdownMenu.Item>
						<DropdownMenu.Item href="/players/new">New</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</li>
			<li aria-current={page.url.pathname.startsWith('/locations') ? 'page' : undefined}>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="nav-trigger">Locations</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item href="/locations">All</DropdownMenu.Item>
						<DropdownMenu.Item href="/locations/new">New</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</li>
			<li aria-current={page.url.pathname.startsWith('/tournaments') ? 'page' : undefined}>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="nav-trigger">Tournaments</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item href="/tournaments">All</DropdownMenu.Item>
						<DropdownMenu.Item href="/tournaments">Results</DropdownMenu.Item>
						<DropdownMenu.Item href="/tournaments">Signup</DropdownMenu.Item>
						<DropdownMenu.Item href="/tournaments/new">New</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner right-corner">
		{#if page.data.user}
			<form method="POST" action="/better-auth?/signOut">
				<button type="submit" class="auth-btn">SignOut</button>
			</form>
		{:else}
			<a href="/better-auth/login" class="auth-btn">SignIn</a>
		{/if}
		<a href="https://github.com/bobjcondon/bridgeserver">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.right-corner {
		width: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-right: 0.5rem;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.right-corner a,
	.right-corner form {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3em;
		width: 3em;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	.auth-btn {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text);
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		white-space: nowrap;
	}

	.auth-btn:hover {
		color: var(--color-theme-1);
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	:global(.nav-trigger) {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s linear;
	}

	:global(.nav-trigger:hover),
	:global(.nav-trigger[data-state='open']) {
		color: var(--color-theme-1);
	}
</style>
