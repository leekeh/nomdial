<script lang="ts">
	import { Button, Combobox, Dialog, Input } from 'components';
	import { cuisinesStore } from 'store';
	import { FetchState, getCoordinates, type CoordinateResult } from 'api';
	import CloseIcon from 'icons/CloseIcon.svelte';

	type Props = {
		updateRestaurants: (
			location: { lat: number; lon: number; city: string },
			maxDistanceKm: number,
			selectedCuisineIds: number[]
		) => void;
		selectedLocation: {
			lat: number;
			city: string;
			lon: number;
		};
		selectedCuisines: { id: number; name: string }[];
		maxDistanceKm: number;
	};

	let {
		updateRestaurants,
		selectedLocation = $bindable(),
		selectedCuisines = $bindable(),
		maxDistanceKm = $bindable()
	}: Props = $props();

	let isDialogOpen = $state(false);

	const toggleDialog = () => {
		isDialogOpen = !isDialogOpen;
	};

	let possibleLocations = $state(new FetchState<CoordinateResult>());

	let query = $state('');
	let isSearching = $state(false);

	function triggerLookup() {
		isSearching = true;
		possibleLocations = getCoordinates(query);
	}

	$effect(() => {
		updateRestaurants(
			selectedLocation,
			maxDistanceKm,
			selectedCuisines?.map((cuisine) => cuisine.id)
		);
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

	function addCuisine(cuisine: { id: number; name: string }) {
		if (!selectedCuisines.some((c) => c.id === cuisine.id)) {
			selectedCuisines.push(cuisine);
		}
	}

	function removeCuisine(cuisine: { id: number; name: string }) {
		selectedCuisines = selectedCuisines.filter((c) => c.id !== cuisine.id);
	}
</script>

<div class="query">
	{selectedCuisines.length === 1 ? selectedCuisines[0].name : 'International'} cuisine {new Intl.NumberFormat(
		'en',
		{
			style: 'unit',
			unit: 'kilometer',
			maximumFractionDigits: 0
		}
	).format(maxDistanceKm)} from {selectedLocation.city}
	<Button onclick={toggleDialog}>Refine search</Button>
</div>

<Dialog bind:isOpen={isDialogOpen} onClose={clearFields}>
	<h1>Refine results</h1>
	<p>Selected location: {selectedLocation.city}</p>

	<Input label="Max distance (km)" type="number" bind:value={maxDistanceKm} />

	{#if isSearching}
		{#if possibleLocations.isLoading}
			<p>Loading...</p>
		{:else if possibleLocations.error || possibleLocations.data?.length === 0}
			<p class="error">No locations were found. Please try again.</p>
		{:else if possibleLocations.data}
			<p>Found {availableLocations().length} locations:</p>
			<ul class="locations">
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

	<h2>Filter by cuisines</h2>

	{#if selectedCuisines.length === 0}
		<p>No cuisines selected</p>
	{:else}
		<ul class="cuisines">
			{#each selectedCuisines as cuisine}
				<li>
					<Button
						ariaLabel={`Remove ${cuisine.name} from filter`}
						onclick={() => removeCuisine(cuisine)}
					>
						{cuisine.name}
						<CloseIcon />
					</Button>
				</li>
			{/each}
		</ul>
	{/if}

	<Combobox
		name="dd"
		label="Add cuisines"
		placeholder="Type to search"
		options={$cuisinesStore.map((cuisine) => ({
			text: cuisine.name,
			value: cuisine.id.toString()
		}))}
		onSelectOption={(option) => {
			addCuisine({ id: Number(option.value), name: option.text });
		}}
	/>
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

	.locations {
		display: flex;
		flex-direction: column;
		gap: var(--grid-4);
	}

	.cuisines {
		display: flex;
		flex-direction: row;
		gap: var(--grid-4);
		flex-wrap: wrap;
	}

	.query {
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
		display: flex;
		gap: var(--grid-8);
	}
</style>
