<script lang="ts">
	import { Button, Dialog } from 'components';
	import { cuisinesStore } from 'store';
	import { createRestaurantId, formatConjunction, formatDistance, zoomRestaurant } from './util';

	let isDialogOpen = $state(false);

	const toggleDialog = () => {
		isDialogOpen = !isDialogOpen;
	};
	let selectedCuisineId = 0;
	let selectedCity = '';
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

<Dialog bind:isOpen={isDialogOpen}>
	{formatConjunction($cuisinesStore.map((store) => store.name))}
	<form method="dialog">
		<Button type="submit">Close</Button>
	</form>
</Dialog>
