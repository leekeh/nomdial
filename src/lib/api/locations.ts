import type { ServerLoadEvent } from '@sveltejs/kit';
import { z } from 'zod';

/**
 * Get the user's location from their IP address,
 * so we have a nice default search radius.
 */
export async function getLocationFromIp(evt: ServerLoadEvent) {
	const defaultLocation = {
		city: 'Utrecht',
		coordinates: {
			lat: 52.0907,
			lon: 5.1214
		}
	};

	try {
		const userIP = evt.getClientAddress();
		if (!userIP || userIP === '::1') {
			return defaultLocation;
		}
		const schema = z.object({
			lat: z.number(),
			lon: z.number(),
			city: z.string()
		});
		const result = evt.fetch(`http://ip-api.com/json/${userIP}?fields=city,lat,lon`);
		const { city, lat, lon } = await (await result).json().then((data) => schema.parse(data));
		return { city, coordinates: { lat, lon } };
	} catch (error) {}
	return defaultLocation;
}
