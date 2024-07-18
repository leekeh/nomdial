<script lang="ts">
	import { ExternalIcon, FoodIcon, PinIcon } from 'icons';
	import { createRestaurantId, formatConjunction, formatDistance, zoomRestaurant } from './util';
	import { Button, Card } from 'components';
	import type { RestaurantsByLocation } from 'api';

	type Props = { restaurants: RestaurantsByLocation };

	const { restaurants }: Props = $props();
</script>

<ul>
	{#each restaurants as restaurant}
		<Card tagName="li" hasBorder id={createRestaurantId(restaurant.id)}>
			<article>
				<h2>
					{restaurant.name}
				</h2>
				<img src="https://placehold.co/200x200" alt="" />

				{formatDistance(restaurant.dist_meters)}
				<p>
					{formatConjunction(restaurant.cuisines)} cuisine
				</p>
				<hr />
				<address>
					Address: {restaurant.address_lines?.join('\n')}
				</address>
				<a
					href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.name}${restaurant.maps_id ? `&destination_place_id=${restaurant.maps_id}` : ''}`}
					target="_blank"
				>
					Get directions
					<ExternalIcon />
				</a>
				<div class="actions">
					<Button onclick={() => zoomRestaurant(restaurant.id)}>
						View on map <PinIcon />
					</Button>
					<Button href={`restaurant/${restaurant.id}`} aria-label={`details ${restaurant.name}`}>
						Details <FoodIcon />
					</Button>
				</div>
			</article>
		</Card>
	{/each}
</ul>

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

	h2 {
		font-family: 'OldNewspaperTypes';
		width: fit-content;
	}

	hr {
		border-top: 2px solid currentColor;
		filter: url(#displaced);
		width: 50%;
	}

	.actions {
		display: flex;
		gap: var(--grid-2);
		padding: var(--grid-4) 0 0;
		flex-wrap: wrap;
		width: 100%;
	}
</style>
