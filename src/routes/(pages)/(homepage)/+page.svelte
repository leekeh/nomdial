<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getRestaurants } from 'api';
	import Map from './map.svelte';
	import { Card } from 'components';
	import { ExternalIcon, FoodIcon, PinIcon } from 'icons';
	let { data } = $props();

	let selectedCuisineId = $state(0);
	let highlightedRestaurantId = $state<number>();
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

	function highlightRestaurant(id: number) {
		highlightedRestaurantId = id;
		document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="layout">
	<div id="query">
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
	<main>
		<Map
			focus={data.clientLocation.coordinates}
			points={restaurants.data?.map((restaurant) => ({
				id: restaurant.id,
				label: restaurant.name,
				lat: restaurant.lat,
				lon: restaurant.long
			}))}
			highlightFunction={highlightRestaurant}
			highlightedId={highlightedRestaurantId}
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
				<ul>
					{#each restaurants.data as restaurant}
						<Card tagName="li" hasBorder id={restaurant.id.toString()}>
							<article>
								<h2>{restaurant.name}</h2>
								<img src="https://placehold.co/200x200" alt="" />

								{restaurant.dist_meters > 1000
									? new Intl.NumberFormat('en', {
											style: 'unit',
											unit: 'kilometer',
											maximumFractionDigits: 0
										}).format(restaurant.dist_meters / 1000)
									: new Intl.NumberFormat('en', {
											style: 'unit',
											unit: 'meter',
											maximumFractionDigits: 0
										}).format(restaurant.dist_meters)} away
								<p>
									Cuisines: {new Intl.ListFormat('en', {
										style: 'long',
										type: 'conjunction'
									}).format(restaurant.cuisines)}
								</p>
								<hr />
								<address>
									Address: {restaurant.address_lines.join('\n')}
								</address>
								<a
									href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.name}${restaurant.maps_id ? `&destination_place_id=${restaurant.maps_id}` : ''}`}
									target="_blank"
								>
									Get directions
									<ExternalIcon />
								</a>
								<div class="actions">
									<button onclick={() => highlightRestaurant(restaurant.id)}>
										View on map <PinIcon />
									</button>
									<button
										onclick={() => alert('Feature coming soon!')}
										aria-label={`details ${restaurant.name}`}
									>
										Details <FoodIcon />
									</button>
								</div>
							</article>
						</Card>
					{/each}
				</ul>
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
	article {
		padding: var(--grid-2);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--grid-2);
	}
	a {
		color: #284283;
		text-decoration: underline;
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

	h2 {
		font-family: 'OldNewspaperTypes';
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

	button {
		outline: 2px solid currentColor;
		border-radius: 500px;
		padding: 0.5rem 1rem;
		filter: url(#squiggle);
	}

	button:hover {
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}

	.actions {
		display: flex;
		gap: var(--grid-2);
		padding: var(--grid-4) 0 0;
		flex-wrap: wrap;
		width: 100%;
	}
</style>
