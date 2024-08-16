<script>
	import { Logo, Card } from 'components';
	import { authStore, cuisinesStore } from 'store';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Session from './Session.svelte';

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
	{@render children()}
	<footer>
		<Card hasBorder>
			<p>© {new Date().getFullYear()} leekeh</p>
		</Card>
	</footer>
</div>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="1.15" />
		</filter>
	</defs>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
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
		padding-top: 4vh;
		width: var(--window-width);
		margin: auto;
		display: flex;
		flex-direction: column;
		gap: var(--grid-4);
	}

	h1 {
		font-size: large;
	}

	@media (min-width: 992px) {
		h1 {
			font-size: x-large;
		}
	}
</style>
