<script>
	import { page } from '$app/stores';
</script>

{#if $page.url.pathname !== '/'}
	<a class="logo" href="/" aria-label="Homepage">Nom·dial</a>
{:else}
	<p class="logo">Nom·dial</p>
{/if}

<style>
	.logo {
		font-size: 1.8rem;
		padding: 0 2rem;
		background-color: rgba(255, 235, 205, 0.674);
		position: relative;
	}

	.logo::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		transform: rotate(5deg);
		background-color: rgba(255, 235, 205, 0.674);
	}
</style>
