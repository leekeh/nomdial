<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = { label: string } & HTMLInputAttributes;

	let { label, value = $bindable(), ...rest }: Props = $props();
</script>

<label>
	<span> {label}:</span>
	<input bind:value {...rest} />
</label>

<style>
	input {
		font-family: 'OldNewspaperTypes';
		background: #fff;
		outline: 2px solid currentColor;
		border-radius: 1.5rem;
		padding: 0.5rem 1rem;
		filter: url(#squiggle);
		border: none;
		font-size: 1.2rem;
	}

	input:hover {
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}

	input::-webkit-search-cancel-button {
		display: none;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--grid-4);
	}
</style>
