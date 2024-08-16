import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function getRestaurants({ url, locals: { supabase } }) {
	const lat = Number(url.searchParams.get('lat'));
	const lon = Number(url.searchParams.get('lon'));
	const maxdist = Number(url.searchParams.get('maxDist'));

	if (isNaN(lat) || isNaN(lon) || isNaN(maxdist)) {
		error(400, 'Invalid query parameters');
	}
	const cuisineIds = url.searchParams.get('cuisineIds');
	const result = await supabase.rpc('nearby_restaurants', {
		lat,
		lon,
		maxdist: maxdist * 1000,
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
