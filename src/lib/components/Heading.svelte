<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = { label: string } & HTMLInputAttributes;

	let { label, value = $bindable(), ...rest }: Props = $props();
</script>

<label>
	{label}
	<input {...rest} />
</label>

<style>
	input {
		font-family: 'OldNewspaperTypes';
		background: #fff;
		outline: 2px solid currentColor;
		border-radius: 1.5rem;
		padding: 0.5rem 1rem;
		filter: url(#squiggle);
	}

	input:hover {
		box-shadow: var(--subtle-shadow);
	}
</style>
