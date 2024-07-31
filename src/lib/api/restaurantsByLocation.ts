import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';
import { z } from 'zod';

type Props = {
	lat: number;
	lon: number;
	cuisineIds?: number[];
	maxDist: number;
};

const restaurantsByLocationSchema = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
		lat: z.number(),
		long: z.number(),
		dist_meters: z.number(),
		city: z.string(),
		website: z.nullable(z.string()),
		maps_id: z.nullable(z.string()),
		address_lines: z.nullable(z.array(z.string())),
		cuisines: z.array(z.string())
	})
);

export type RestaurantsByLocation = z.infer<typeof restaurantsByLocationSchema>;

export function getRestaurantsByLocation({ lat, lon, cuisineIds, maxDist }: Props) {
	const params = new URLSearchParams();
	params.set('lat', lat.toString());
	params.set('lon', lon.toString());
	params.set('maxDist', maxDist.toString());
	if (cuisineIds?.length) {
		params.set('cuisineIds', cuisineIds.join(','));
	}

	const path = `restaurants?${params.toString()}`;

	return APICall<RestaurantsByLocation>(path, { method: 'GET' }, restaurantsByLocationSchema);
}

export async function getRestaurantsByLocationAsync(
	{ lat, lon, cuisineIds }: Props,
	passedFetch: Fetch
) {
	const params = new URLSearchParams();
	params.set('lat', lat.toString());
	params.set('lon', lon.toString());
	if (cuisineIds) {
		params.set('cuisineIds', cuisineIds.join(','));
	}

	const path = `restaurants?${params.toString()}`;

	return asyncAPICall<RestaurantsByLocation>(
		path,
		{ method: 'GET' },
		restaurantsByLocationSchema,
		passedFetch
	);
}
