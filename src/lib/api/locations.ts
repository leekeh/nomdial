import { APICall, asyncAPICall, type Fetch } from 'api/util.svelte';
import { z } from 'zod';

const locationSchema = z.object({
	lat: z.number(),
	lon: z.number(),
	city: z.string()
});

export type Location = z.infer<typeof locationSchema>;

export function getLocationFromIP(ip: string) {
	const headers = new Headers();
	headers.append('X-Forwarded-For', ip);
	return APICall(`locationFromIP/`, { method: 'GET', headers }, locationSchema);
}

export async function getLocationFromIPAsync(ip: string, passedFetch: Fetch) {
	const headers = new Headers();
	headers.append('X-Forwarded-For', ip);
	return asyncAPICall(`locationFromIP/`, { method: 'GET', headers }, locationSchema, passedFetch);
}
