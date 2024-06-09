<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getRestaurants } from 'api';
	let { data } = $props();

	let selectedCuisineId = $state(0);
	let selectedCity = $state(data.clientLocation.city);
	let restaurants = $state(data.restaurants);
	let selectedCoordinates = data.clientLocation.coordinates;

	function lookupLocation(evt: Parameters<ChangeEventHandler<HTMLInputElement>>['0']) {
		//todo
	}

	async function updateRestaurants() {
		restaurants = await getRestaurants({
			...selectedCoordinates,
			cuisineIds: selectedCuisineId ? [selectedCuisineId] : undefined
		});
	}
</script>

<h1>Polynom</h1>

<div>
	I am looking for <select
		bind:value={selectedCuisineId}
		onchange={updateRestaurants}
		name="cuisine"
	>
		<option value={0}>international</option>
		<hr />
		{#each data.availableCuisines as cuisine}
			<option value={cuisine.id}>{cuisine.name}</option>
		{/each}
		<hr />
		<option disabled>More options coming soon!</option>
	</select>
	cuisine near <input bind:value={selectedCity} onchange={lookupLocation} type="text" />
</div>

{#if restaurants.length === 0}
	<p>No restaurants were found. If you have any recommendations, please let us know!</p>
{:else}
	<ul>
		{#each restaurants as restaurant}
			<li>
				<h2>{restaurant.name}</h2>
			</li>
		{/each}
	</ul>
{/if}
