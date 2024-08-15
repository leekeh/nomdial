<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		hasBorder?: boolean;
		tagName?: 'div' | 'li';
		id?: string;
		style?: string;
	};

	let { children, hasBorder = false, tagName = 'div', id, style }: Props = $props();
</script>

<svelte:element this={tagName} class="card" {id} class:hasBorder {style}>
	{@render children()}
</svelte:element>

<style>
	.card {
		background: #fff;
		padding: var(--grid-2);
		position: relative;
		border-radius: 255px 15px 225px 2px/5px 225px -10px 255px;
		overflow: hidden;
		font-family: 'OldNewspaperTypes';
	}

	.hasBorder {
		background: transparent;
	}

	.hasBorder::before {
		position: absolute;
		filter: url(#squiggle);
		content: '';
		top: 2px;
		left: 2px;
		right: 1px;
		bottom: 3px;
		border: 2px solid var(--fg-primary);
		pointer-events: none;
		overflow: hidden;
		z-index: -1;
		background: #fff;
		box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
	}

	.hasBorder:nth-of-type(2n)::before {
		filter: url(#displaced);
	}

	@media (min-width: 768px) {
		div {
			padding: var(--grid-4);
		}
	}
</style>
