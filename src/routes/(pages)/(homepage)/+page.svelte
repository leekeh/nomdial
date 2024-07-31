<script lang="ts">
	import { getRestaurantsByLocation } from 'api';
	import Map from './Map.svelte';
	import { Card } from 'components';

	import Restaurants from './Restaurants.svelte';
	import Query from './Query.svelte';

	let { data } = $props();

	let selectedLocation = $state(data.estimatedLocation);
	let restaurants = $state(data.restaurants);
	let selectedCuisines = $state([]);
	let maxDistanceKm = $state(100);

	async function updateRestaurants(
		location: { lat: number; lon: number; city: string },
		maxDistanceKm: number,
		selectedCuisineIds?: number[]
	) {
		restaurants = getRestaurantsByLocation({
			lat: location.lat,
			lon: location.lon,
			cuisineIds: selectedCuisineIds,
			maxDist: maxDistanceKm
		});
	}
</script>

<Query bind:selectedLocation bind:selectedCuisines bind:maxDistanceKm {updateRestaurants} />

<div class="layout">
	<main>
		<Map
			focus={{ lat: selectedLocation.lat, lon: selectedLocation.lon }}
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
			{:else if restaurants.hasError}
				{#if restaurants.error instanceof Error && restaurants.error.message === 'Not Found'}
					<p>No restaurants were found. You can help by adding restaurants to the database.</p>
				{:else}
					<p>There was an error loading the restaurants. Please try again later.</p>
				{/if}
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
</style>
