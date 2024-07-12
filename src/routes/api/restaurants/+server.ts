import { error, type RequestHandler } from '@sveltejs/kit';
import { supabase } from 'db';

export const GET: RequestHandler = async function getRestaurants({ url }) {
	const lat = Number(url.searchParams.get('lat'));
	const lon = Number(url.searchParams.get('lon'));
	if (isNaN(lat) || isNaN(lon)) {
		error(400, 'Invalid lat or lon');
	}
	const cuisineIds = url.searchParams.get('cuisineIds');
	const result = await supabase.rpc('nearby_restaurants', {
		lat: lat,
		lon: lon,
		...(cuisineIds ? { cuisine_filter: cuisineIds } : {})
	});
	if (result.error) {
		error(500, result.error);
	}
	if (!result.data?.length) {
		error(404, 'No restaurants found');
	}
	return new Response(JSON.stringify(result.data));
};
