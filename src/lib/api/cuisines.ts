import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';
import { z } from 'zod';

const cuisinesSchema = z.array(
	z.object({
		name: z.string(),
		id: z.number()
	})
);
export type Cuisines = z.infer<typeof cuisinesSchema>;

export function getCuisines() {
	return APICall(`cuisines`, { method: 'GET' }, cuisinesSchema);
}

export async function getCuisinesAsync(passedFetch: Fetch) {
	return asyncAPICall(`cuisines`, { method: 'GET' }, cuisinesSchema, passedFetch);
}
