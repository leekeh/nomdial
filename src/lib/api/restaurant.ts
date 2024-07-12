import { restaurantsRowSchema } from 'db';
import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';

export type Restaurant = Zod.infer<typeof restaurantsRowSchema>;

export function getRestaurantById(id: number) {
	return APICall<Restaurant>(`restaurant/${id}`, { method: 'GET' }, restaurantsRowSchema);
}

export async function getRestaurantByIdAsync(id: number, passedFetch: Fetch) {
	return asyncAPICall<Restaurant>(
		`restaurant/${id}`,
		{ method: 'GET' },
		restaurantsRowSchema,
		passedFetch
	);
}
