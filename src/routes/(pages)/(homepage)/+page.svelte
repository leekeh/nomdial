<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getRestaurantsByLocation } from 'api';
	import Map from './Map.svelte';
	import { Card } from 'components';

	import Restaurants from './Restaurants.svelte';
	import Query from './Query.svelte';

	let { data } = $props();

	let selectedCuisineId = $state(0);
	let selectedCity = $state(data.estimatedLocation.city);
	let restaurants = $state(data.restaurants);
	let selectedCoordinates = { lat: data.estimatedLocation.lat, lon: data.estimatedLocation.lon };

	function lookupLocation(evt: Parameters<ChangeEventHandler<HTMLInputElement>>['0']) {
		//todo
	}

	async function updateRestaurants() {
		restaurants = getRestaurantsByLocation({
			...selectedCoordinates,
			cuisineIds: selectedCuisineId ? [selectedCuisineId] : undefined
		});
	}
</script>

<Query />

<div class="layout">
	<main>
		<Map
			focus={selectedCoordinates}
			points={restaurants.data?.map((restaurant) => ({
				id: restaurant.id,
				label: restaurant.name,
				lat: restaurant.lat,
				lon: restaurant.long
			}))}
		/>
		<div class="results">
			{#if restaurants.isLoading}
				<Card hasBorder>
					<img src="egg.gif" alt="" style="outline: none" />
					<p>Loading...</p>
				</Card>
			{:else if restaurants.error}
				<p>There was an error loading the restaurants. Please try again later.</p>
			{:else if !restaurants.data || restaurants.data?.length === 0}
				<p>No restaurants were found. If you have any recommendations, please let us know!</p>
			{:else}
				<Restaurants restaurants={restaurants.data} />
			{/if}
		</div>
	</main>
</div>

<style>
	img {
		float: right;
		border: 5px solid #fff;
		outline: 1px solid #ccc;
	}

	main {
		display: grid;
		gap: var(--grid-2);
		position: relative;
	}

	@media (min-width: 992px) {
		main {
			grid-template-columns: 1fr 1fr;
			gap: var(--grid-4);
		}
	}

	.results {
		overflow: auto;
	}

	#query {
		background-color: #ffc;
		padding: 1rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		width: fit-content;
		font-family: 'BambiHandwritten';
		font-size: 2rem;
		color: #284283;
		box-shadow:
			inset 0 -40px 40px rgba(184, 188, 80, 0.06),
			inset 0 25px 10px rgba(224, 215, 45, 0.06),
			0 5px 6px 5px rgba(0, 0, 0, 0.03);
	}

	hr {
		border-top: 2px solid currentColor;
		filter: url(#displaced);
		width: 50%;
	}
</style>
