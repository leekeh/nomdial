<script lang="ts">
	import { Button, Dialog, Input } from 'components';
	import { cuisinesStore } from 'store';
	import { formatConjunction } from './util';
	import { FetchState, getCoordinates, type CoordinateResult } from 'api';
	import type { Coordinates } from 'types';
	import { array } from 'zod';

	type Props = {
		updateRestaurants: (
			location: { lat: number; lon: number; city: string },
			selectedCuisineIds?: number[]
		) => void;
		selectedLocation: {
			lat: number;
			city: string;
			lon: number;
		};
	};

	let { updateRestaurants, selectedLocation = $bindable() }: Props = $props();

	let isDialogOpen = $state(false);

	const toggleDialog = () => {
		isDialogOpen = !isDialogOpen;
	};

	let possibleLocations = $state(new FetchState<CoordinateResult>());
	let selectedCuisines = $state([]);

	let query = $state('');
	let isSearching = $state(false);

	function triggerLookup() {
		isSearching = true;
		possibleLocations = getCoordinates(query);
	}

	$effect(() => {
		updateRestaurants(selectedLocation, selectedCuisines);
	});
	function handleSearchKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			triggerLookup();
		}
	}
	function setLocation(location: CoordinateResult[0]) {
		selectedLocation = {
			lat: location.lat,
			lon: location.lon,
			city: location.name
		};
		query = '';
		isSearching = false;
	}
	const availableLocations = $derived(() => {
		if (possibleLocations.data) {
			let result: CoordinateResult = [];
			for (let location of possibleLocations.data) {
				if (
					result.some(
						(loc) =>
							loc.name === location.name &&
							loc.state === location.state &&
							loc.country === location.country
					)
				) {
					continue;
				}
				result.push(location);
			}
			if (result.length === 1) {
				setLocation(result[0]);
			}
			return result;
		}
		return [];
	});

	function clearFields() {
		query = '';
		possibleLocations = new FetchState<CoordinateResult>();
		isSearching = false;
	}
</script>

<div id="query">
	<!-- {$cuisinesStore.map((store) => store.name).join('')} -->
	<!-- I am looking for <select
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
			{#if data.availableCuisines?.data}
				{#each data.availableCuisines.data as cuisine}
					<option value={cuisine.id}>{cuisine.name}</option>
				{/each}
			{/if}
		{/if}

		<hr />
		<option disabled>More options coming soon!</option>
	</select>
	cuisine near <input bind:value={selectedCity} onchange={lookupLocation} type="text" /> -->

	<Button onclick={toggleDialog}>Refine search</Button>
</div>

<Dialog bind:isOpen={isDialogOpen} onClose={clearFields}>
	<h1>Refine results</h1>
	<p>Selected location: {selectedLocation.city}</p>

	{#if isSearching}
		{#if possibleLocations.isLoading}
			<p>Loading...</p>
		{:else if possibleLocations.error || possibleLocations.data?.length === 0}
			<p class="error">No locations were found. Please try again.</p>
		{:else if possibleLocations.data}
			<p>Found {availableLocations().length} locations:</p>
			<ul>
				{#each availableLocations() as location}
					<li>
						<Button onclick={() => setLocation(location)}>
							{location.name}
							{location.state}
							{location.country}
						</Button>
					</li>
				{/each}
			</ul>
		{/if}
		<Button onclick={() => (isSearching = false)}>Try again</Button>
	{:else}
		<div id="searchSection">
			<Input
				label="Look up a place"
				onkeydown={handleSearchKeyDown}
				placeholder="Utrecht"
				bind:value={query}
				type="search"
				aria-invalid={!!possibleLocations.error}
			/>
			<Button onclick={triggerLookup}>search</Button>
		</div>
	{/if}

	<hr />
</Dialog>

<style>
	.error {
		color: red;
	}

	#searchSection {
		display: flex;
		flex-direction: row;
		align-items: end;
		gap: var(--grid-4);
		flex-wrap: wrap;
	}

	hr {
		border-top: 2px solid currentColor;
		filter: url(#displaced);
		width: 80%;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--grid-4);
	}
</style>
