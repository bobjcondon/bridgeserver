<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
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
			<li class="has-dropdown" aria-current={page.url.pathname.startsWith('/players') ? 'page' : undefined}>
				<button class="nav-trigger">Players</button>
				<div class="dropdown-menu">
					<a href={resolve('/players')}>All</a>
					<a href={resolve('/players/new')}>New</a>
				</div>
			</li>
			<li class="has-dropdown" aria-current={page.url.pathname.startsWith('/locations') ? 'page' : undefined}>
				<button class="nav-trigger">Locations</button>
				<div class="dropdown-menu">
					<a href={resolve('/locations')}>All</a>
					<a href={resolve('/locations/new')}>New</a>
				</div>
			</li>
			<li class="has-dropdown" aria-current={page.url.pathname.startsWith('/tournaments') ? 'page' : undefined}>
				<button class="nav-trigger">Tournaments</button>
				<div class="dropdown-menu">
					<a href={resolve('/tournaments')}>All</a>
					<a href={resolve('/tournaments')}>Results</a>
					<a href={resolve('/tournaments')}>Signup</a>
					<a href={resolve('/tournaments/new')}>New</a>
				</div>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner right-corner">
		{#if page.data.user}
			<form method="POST" action="/better-auth?/signOut">
				<button type="submit" class="auth-btn">SignOut {page.data.user.name.split(' ')[0]}</button>
			</form>
		{:else}
			<a href={resolve('/better-auth/login')} class="auth-btn">SignIn</a>
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

	/* Trigger button styled to match nav links */
	.nav-trigger {
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

	.nav-trigger:hover,
	.has-dropdown:hover .nav-trigger,
	.has-dropdown:focus-within .nav-trigger {
		color: var(--color-theme-1);
	}

	/* Dropdown panel — hidden until hover/focus */
	.dropdown-menu {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 50;
		min-width: 8rem;
		flex-direction: column;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 0.375rem;
		padding: 0.25rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.has-dropdown:hover .dropdown-menu,
	.has-dropdown:focus-within .dropdown-menu {
		display: flex;
	}

	/* Override nav a styles for dropdown items */
	.dropdown-menu a {
		height: auto;
		padding: 0.375rem 0.5rem;
		font-size: 0.875rem;
		font-weight: 400;
		text-transform: none;
		letter-spacing: normal;
		color: var(--color-text);
		border-radius: 0.25rem;
		transition: background 0.1s;
	}

	.dropdown-menu a:hover {
		background: rgba(0, 0, 0, 0.06);
		color: var(--color-text);
	}
</style>
