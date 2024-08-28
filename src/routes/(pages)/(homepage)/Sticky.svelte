<script lang="ts">
	import { formatDistance } from './util';

	type Props = {
		selectedCuisines: { id: number; name: string }[];
		maxDistanceKm: number;
		city: string;
		onclick: () => void;
	};

	let { selectedCuisines, maxDistanceKm, city, onclick }: Props = $props();
</script>

<div class="query lined-paper">
	<p>{new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date())}</p>
	<p>
		I am looking for
		{selectedCuisines.length === 1 ? selectedCuisines[0].name : 'international'} cuisine within {formatDistance(
			maxDistanceKm * 1000
		)} of {city}.
	</p>
	<button {onclick}>Refine search</button>
</div>

<style>
	.query {
		margin: 2rem auto;
		max-width: 30ch;
		display: flex;
		flex-direction: column;
		transform: rotate(-1deg);
	}

	button:hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-decoration-skip-ink: none;
	}
</style>
