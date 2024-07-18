<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';

	type Props = {
		children: Snippet;
		isOpen: boolean;
	};

	let { children, isOpen = $bindable() }: Props = $props();

	let dialog: HTMLDialogElement;
	onMount(async () => {
		const body = document.body;
		body.appendChild(dialog);
		const dialogPolyfill = (await import('dialog-polyfill')).default;
		dialogPolyfill.registerDialog(dialog);

		dialog.addEventListener('click', function (event) {
			var rect = dialog.getBoundingClientRect();
			var isInDialog =
				rect.top <= event.clientY &&
				event.clientY <= rect.top + rect.height &&
				rect.left <= event.clientX &&
				event.clientX <= rect.left + rect.width;
			if (!isInDialog) {
				isOpen = false;
			}
		});
	});

	$effect(() => {
		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});
</script>

<dialog bind:this={dialog}>
	<form method="dialog">
		<Button ariaLabel="Close menu" type="submit">X</Button>
	</form>
	{@render children()}
</dialog>

<style>
	dialog::backdrop,
	:global(dialog + .backdrop) {
		background-color: rgba(0, 0, 0, 0.463);
		backdrop-filter: blur(5px);
	}

	dialog {
		background: transparent;
		min-width: 50vw;
		min-height: 30vh;
		position: relative;
		border: none;
		border-radius: 1rem;
	}

	dialog::before {
		position: absolute;
		filter: url(#squiggle);
		content: '';
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 1rem;
		border: 2px solid var(--fg-primary);
		pointer-events: none;
		overflow: hidden;
		z-index: -1;
		background: #fff;
		box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
	}

	form {
		float: right;
		padding-left: var(--grid-2);
		padding-bottom: var(--grid-2);
	}
</style>
