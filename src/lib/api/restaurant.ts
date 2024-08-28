import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';
import { z } from 'zod';

const restaurantSchema = z.object({
	address_lines: z.array(z.string()).nullable(),
	city: z.string().nullable(),
	country_code: z.string(),
	created_at: z.string(),
	id: z.number(),
	location: z.unknown(),
	maps_id: z.string().nullable(),
	name: z.string(),
	osm_id: z.number().nullable(),
	website: z.string().nullable(),
	cuisines: z.array(z.object({ id: z.number(), name: z.string() }))
});

export type Restaurant = Zod.infer<typeof restaurantSchema>;

export function getRestaurantById(id: number) {
	return APICall<Restaurant>(`restaurant/${id}`, { method: 'GET' }, restaurantSchema);
}

export async function getRestaurantByIdAsync(id: number, passedFetch: Fetch) {
	return asyncAPICall<Restaurant>(
		`restaurant/${id}`,
		{ method: 'GET' },
		restaurantSchema,
		passedFetch
	);
}
