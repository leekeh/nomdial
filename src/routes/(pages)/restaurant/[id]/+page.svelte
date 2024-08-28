<script lang="ts">
	import { Button, Card } from 'components';

	let { data } = $props();
	const restaurant = data.restaurant.data!;

	import { authStore } from 'store';

	let isEditing = $state(false);

	function onSave() {
		isEditing = false;
	}
</script>

<Card hasBorder>
	{#if isEditing}
		Editing
		<form></form>

		<Button onclick={onSave}>Save</Button>
	{:else}
		{#if $authStore.session}
			<Button
				onclick={() => {
					isEditing = true;
				}}>Edit</Button
			>
		{/if}
		<h2>{restaurant.name}</h2>
		<img src="https://placehold.co/200x200" alt="" />
		<p>{restaurant.address_lines?.join('\n')}</p>
		<p>{restaurant.city}</p>
		<p>{restaurant.country_code}</p>
		<p>{restaurant.website}</p>
		<p>{restaurant.cuisines?.map((a) => a.name)}</p>
	{/if}
</Card>
