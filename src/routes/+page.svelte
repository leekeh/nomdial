<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	export let data;

	let selectedCuisineId = 0;
	let selectedCity = data.clientLocation.city;
	let selectedCoordinates = data.clientLocation.coordinates;

	function lookupLocation(evt: Parameters<ChangeEventHandler<HTMLInputElement>>['0']) {
		//todo
	}
</script>

<h1>Polynom</h1>

<div>
	I am looking for <select bind:value={selectedCuisineId} name="cuisine">
		<option value="0" disabled>Cuisine</option>
		<hr />
		{#each data.availableCuisines ?? [] as cuisine}
			<option value={cuisine.id}>{cuisine.name}</option>
		{/each}
		<hr />
		<option disabled>More options coming soon!</option>
	</select>
	cuisine near <input bind:value={selectedCity} on:change={lookupLocation} type="text" />
</div>

{#each data.restaurants.data as restaurant}
	<div>
		<h2>{restaurant.name}</h2>
	</div>
{/each}

test: {selectedCuisineId}
