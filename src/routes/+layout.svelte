<script>
	import { Logo, Card } from 'components';

	let { children } = $props();
</script>

<div>
	<heading>
		<h1><Logo /></h1>
	</heading>
	{@render children()}
	<footer>
		<Card hasBorder>
			<p>© {new Date().getFullYear()} leekeh</p>
		</Card>
	</footer>
</div>

<style>
	:global(body) {
		background-image: url(bg.svg);
		background-attachment: fixed;
	}
	div {
		padding-top: 4vh;
		width: var(--window-width);
		margin: auto;
	}

	h1 {
		font-size: large;
	}

	@media (min-width: 992px) {
		h1 {
			font-size: x-large;
		}
	}

	footer {
		margin-top: var(--grid-4);
	}
</style>
