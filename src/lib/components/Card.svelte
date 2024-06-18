<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		hasBorder?: boolean;
		tagName?: 'div' | 'li';
		id?: string;
	};

	let { children, hasBorder = false, tagName = 'div', id }: Props = $props();
</script>

<svelte:element this={tagName} class="card" {id} class:hasBorder>
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

	.hasBorder::before {
		position: absolute;
		content: '';
		top: 2px;
		left: 2px;
		right: 1px;
		bottom: 3px;
		border: 2px solid var(--fg-primary);
		border-radius: 255px 15px 225px 10px/5px 225px 2px 255px;
		pointer-events: none;
	}

	.hasBorder:nth-of-type(2n)::before {
		top: 6px;
		left: 3px;
		right: 5px;
		bottom: 4px;
	}

	.hasBorder:nth-of-type(3n)::before {
		border-radius: 255px 5px 225px 5px/5px 225px 10px 255px;
	}

	@media (min-width: 768px) {
		div {
			padding: var(--grid-4);
		}
	}
</style>
