<script>
	import { Card } from 'components';
	import { page } from '$app/stores';
</script>

<Card hasBorder style="width: fit-content;">
	{#if $page.url.pathname !== '/'}
		<a class="logo" href="/" aria-label="Homepage">Nom·dial</a>
	{:else}
		<p class="logo">Nom·dial</p>
	{/if}
</Card>

<style>
	.logo {
		font-size: 1.8rem;
		margin: 0 2rem;
	}
</style>
