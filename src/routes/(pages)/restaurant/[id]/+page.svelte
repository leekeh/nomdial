<script lang="ts">
	import { Card } from 'components';

	let { data } = $props();
	const restaurant = data.restaurant.data!;
</script>

<Card hasBorder>
	<h1>{restaurant.name}</h1>
	<img src="https://placehold.co/200x200" alt="" />
	<p>{restaurant.address_lines?.join('\n')}</p>
	<p>{restaurant.city}</p>
	<p>{restaurant.country_code}</p>
	<p>{restaurant.website}</p>
	<!-- <p>{restaurant.cuisines.join(', ')}</p> -->
</Card>
