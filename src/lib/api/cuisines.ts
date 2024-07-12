import { cuisinesRowSchema } from 'db';
import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';
import { z } from 'zod';

const cuisinesSchema = z.array(cuisinesRowSchema);
export type Cuisine = z.infer<typeof cuisinesSchema>;

export function getCuisines() {
	return APICall(`cuisines`, { method: 'GET' }, cuisinesSchema);
}

export async function getCuisinesAsync(passedFetch: Fetch) {
	return asyncAPICall(`cuisines`, { method: 'GET' }, cuisinesSchema, passedFetch);
}
