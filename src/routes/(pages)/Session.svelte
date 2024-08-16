<script lang="ts">
	import type { Provider } from '@supabase/supabase-js';
	import { Button, Dialog, Input } from 'components';
	import { UserIcon } from 'icons';
	import { authStore } from 'store';
	import { onMount } from 'svelte';
	import { capitalizeFirstLetter } from 'utils';

	let isDialogOpen = $state(false);
	let hasError = $state(false);
	let lastProvider: string | null = null;

	const toggleDialog = () => {
		isDialogOpen = !isDialogOpen;
	};

	authStore.subscribe((store) => {
		if (!store.auth?.signInWithOAuth) {
			hasError = true;
		} else {
			hasError = false;
		}
	});

	onMount(() => {
		lastProvider = localStorage.getItem('authProvider');
	});

	const providers: Provider[] = ['google', 'facebook'];
</script>

{#if $authStore.user && $authStore.session}
	<Button onclick={toggleDialog}>
		<UserIcon />
		{$authStore.user.user_metadata.full_name}
	</Button>
	<Dialog bind:isOpen={isDialogOpen}>
		<h2>Logged in</h2>
		<p>Welcome back, {$authStore.user.user_metadata.full_name}!</p>
		<hr />
		<h3>Account settings</h3>
		{#if $authStore.user.user_metadata.avatar_url}
			<img src={$authStore.user.user_metadata.avatar_url} alt="Profile picture" />
		{/if}
		<Input type="text" label="Full name" bind:value={$authStore.user.user_metadata.full_name} />
		<Input type="email" label="Email" bind:value={$authStore.user.email} />
		<hr />
		<Button onclick={() => $authStore.auth?.signOut()}>Sign out</Button>
	</Dialog>
{:else}
	<Button onclick={toggleDialog}>
		<UserIcon />
		Sign in
	</Button>
	<Dialog bind:isOpen={isDialogOpen}>
		<h2>Log in</h2>
		<p>In order to be able to post comments and update information, you need to log in.</p>
		{#if hasError}
			<p>There was an error loading the authentication service. Please try again later.</p>
		{:else}
			<p>Pressing any of the buttons will redirect you to the respective service.</p>
			{#each providers as provider}
				<Button
					onclick={() =>
						$authStore.auth!.signInWithOAuth?.({
							provider
						})}
				>
					<img height="28" width="24" src={`authproviders/${provider}.png`} alt="" />
					Sign in with {capitalizeFirstLetter(provider)}
					{#if lastProvider === provider}
						<span style="font-size: 1rem">(used before)</span>
					{/if}
				</Button>
			{/each}
			<p style="font-size: 1rem;">
				P.S. We do not store any personal information. We simply want to be able to trace activity
				back to accounts in order to protect Nomdial against malicious users. You can delete your
				account at any time :)
			</p>
		{/if}
	</Dialog>
{/if}

<style>
	hr {
		border-top: 2px solid currentColor;
		filter: url(#displaced);
		width: 80%;
	}
</style>
