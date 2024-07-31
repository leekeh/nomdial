import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';
import { z } from 'zod';

const locationSchema = z.array(
	z.object({
		lat: z.number(),
		lon: z.number(),
		country: z.string(),
		state: z.string().optional(),
		name: z.string()
	})
);

export type CoordinateResult = z.infer<typeof locationSchema>;

export function getCoordinates(query: string) {
	const params = new URLSearchParams();
	params.set('query', query);
	const path = `coordinates?${params.toString()}`;
	return APICall(path, { method: 'GET' }, locationSchema);
}

export async function getCoordinatesAsync(query: string, passedFetch: Fetch) {
	const params = new URLSearchParams();
	params.set('query', query);
	const path = `coordinates?${params.toString()}`;
	return asyncAPICall(path, { method: 'GET' }, locationSchema, passedFetch);
}
