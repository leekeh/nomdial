<script>
	import { Logo } from 'components';
	import { authStore, cuisinesStore } from 'store';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Session from './Session.svelte';
	import TabNavigation from './TabNavigation.svelte';

	let { children, data } = $props();

	$effect(() => {
		const {
			supabase: { auth },
			session,
			user
		} = data;
		authStore.set({
			session,
			user,
			auth
		});
	});

	onMount(() => {
		const {
			supabase: { auth },
			session,
			user
		} = data;
		const { data: authData } = auth.onAuthStateChange((_, newSession) => {
			authStore.update((oldStore) => ({ ...oldStore, session: newSession }));
			const usedProvider = session?.user.app_metadata.provider;
			if (usedProvider) {
				localStorage.setItem('authProvider', usedProvider);
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authData.subscription.unsubscribe();
	});

	if (data.cuisines.data) {
		cuisinesStore.set(data.cuisines.data);
	}
</script>

<div>
	<heading>
		<h1><Logo /></h1>
		<Session />
	</heading>
	<TabNavigation>
		{@render children()}
	</TabNavigation>
	<footer>
		<p>
			© {new Date().getFullYear()} <a href="https://www.leekeh.com/" target="_blank">leekeh</a>
		</p>
	</footer>
</div>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="1.15" />
		</filter>
		<filter id="displaced">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="2" />
		</filter>
	</defs>
</svg>

<style>
	heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	:global(body) {
		background-image: url('/background.svg');
		background-attachment: fixed;
	}
	div {
		width: var(--window-width);
		margin: auto;
		display: flex;
		flex-direction: column;
		gap: var(--grid-4);
		position: relative;
	}

	@media (min-width: 768px) {
		div {
			padding: 1rem;
		}

		div::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: beige;
			z-index: -1;
			background-image: url(cardboard.webp);
			border-radius: 1rem;
			box-shadow:
				inset 0 0 10px rgba(0, 0, 0, 0.373),
				rgba(0, 0, 0, 0.35) 0px 5px 15px;
		}
	}

	h1 {
		font-size: large;
	}

	@media (min-width: 992px) {
		h1 {
			font-size: x-large;
		}
	}

	footer {
		box-shadow: var(--subtle-shadow);
		align-self: flex-end;
		opacity: 0.8;
		font-family: Times, serif;
		font-size: 1.8rem;
		color: rgba(188, 181, 143, 0.3);
		text-shadow:
			-1px -1px 0px rgba(255, 248, 209, 0.3),
			1px 1px 0px rgba(76, 45, 8, 0.8);
	}

	footer a {
		color: inherit;
		text-decoration: none;
	}
</style>
