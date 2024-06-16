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
		restaurants = getRestaurants({
			...selectedCoordinates,
			cuisineIds: selectedCuisineId ? [selectedCuisineId] : undefined
		});
	}
</script>

<div class="layout">
	<heading>
		<h1>Polynom</h1>

		<div>
			I am looking for <select
				bind:value={selectedCuisineId}
				onchange={updateRestaurants}
				name="cuisine"
			>
				<option value={0}>international</option>
				<hr />
				{#if data.availableCuisines.isLoading || !data.availableCuisines}
					<option disabled>Loading...</option>
				{:else}
					<option disabled>Select a cuisine</option>
					{#each data.availableCuisines.data || [] as cuisine}
						<option value={cuisine.id}>{cuisine.name}</option>
					{/each}
				{/if}

				<hr />
				<option disabled>More options coming soon!</option>
			</select>
			cuisine near <input bind:value={selectedCity} onchange={lookupLocation} type="text" />
		</div>
	</heading>
	<div class="scrollcontainer">
		<main>
			{#if restaurants.isLoading}
				<p>Loading...</p>
			{:else if restaurants.error}
				<p>There was an error loading the restaurants. Please try again later.</p>
			{:else if !restaurants.data || restaurants.data?.length === 0}
				<p>No restaurants were found. If you have any recommendations, please let us know!</p>
			{:else}
				<ul>
					{#each restaurants.data as restaurant}
						<li>
							<h2>{restaurant.name}</h2>
							{restaurant.dist_meters}
							{JSON.stringify(restaurant)}
						</li>
					{/each}
				</ul>
			{/if}
		</main>

		<footer>
			<p>© {new Date().getFullYear()} leekeh</p>
		</footer>
	</div>
</div>

<style>
	footer {
		background-color: var(--color-primary);
		color: var(--color-secondary);
		display: flex;
	}
	footer p,
	heading,
	main {
		width: var(--window-width);
		margin: auto;
	}

	heading {
		border-bottom: 2px solid var(--color-primary);
		padding-top: var(--grid-2);
		padding-bottom: var(--grid-2);
	}

	.layout {
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100vh;
		overflow: hidden;
	}

	.scrollcontainer {
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	main {
		flex-grow: 1;
	}
</style>
