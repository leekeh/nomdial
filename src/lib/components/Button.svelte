<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		ariaLabel?: string;
	} & (HTMLAnchorAttributes | HTMLButtonAttributes);

	let { children, ariaLabel, href, target, onclick }: Props = $props();
</script>

{#if href}
	<a class="button" {href} {target} aria-label={ariaLabel}>
		{@render children()}
	</a>
{:else}
	<button class="button" {onclick}>
		{@render children()}
	</button>
{/if}

<style>
	.button {
		font-family: 'OldNewspaperTypes';
		background: #fff;
		outline: 2px solid currentColor;
		border-radius: 1.5rem;
		padding: 0.5rem 1rem;
		filter: url(#squiggle);
		font-size: 1.2rem;
	}

	.button:hover {
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}
</style>
