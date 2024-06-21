<script lang="ts" context="module">
	import type { Snippet } from 'svelte';

	export type Props = {
		children: Snippet;
	};
</script>

<script lang="ts">
	let { children }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	stroke-width="2"
	stroke="currentColor"
	fill="none"
	stroke-linecap="round"
	stroke-linejoin="round"
	filter="url(#squiggle)"
>
	{@render children()}
</svg>
