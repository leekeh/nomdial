import type { ServerLoadEvent } from '@sveltejs/kit';
import { supabase } from 'db';
import { z } from 'zod';

type Coordinates = {
	lat: number;
	lon: number;
};

const defaultLocation = {
	city: 'Utrecht',
	coordinates: {
		lat: 52.0907,
		lon: 5.1214
	}
};

/**
 * Get the user's location from their IP address,
 * so we have a nice default search radius.
 */
async function getLocation(evt: ServerLoadEvent) {
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

async function getRestaurants({ lat, lon }: Coordinates, fetch) {
	return await (await fetch(`/api/restaurants/getByLocation/${lat}/${lon}`)).json();
}

async function getAvailableCuisines() {
	return (await supabase.from('cuisines').select('name, id')).data;
}

export async function load(evt) {
	const { fetch } = evt;
	const clientLocation = await getLocation(evt, fetch);
	const [restaurants, availableCuisines] = await Promise.all([
		getRestaurants(clientLocation?.coordinates, fetch),
		getAvailableCuisines()
	]);

	return {
		restaurants,
		availableCuisines,
		clientLocation
	};
}
