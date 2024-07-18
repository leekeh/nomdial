<script>
	import { Logo, Card } from 'components';
	import { cuisinesStore } from 'store';

	let { children, data } = $props();

	if (data.cuisines.data) {
		cuisinesStore.set(data.cuisines.data);
	}
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

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="1.15" />
		</filter>
	</defs>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="displaced">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".05" numOctaves="100" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="2" />
		</filter>
	</defs>
</svg>

<style>
	:global(body) {
		background-image: url('/background.svg');
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
