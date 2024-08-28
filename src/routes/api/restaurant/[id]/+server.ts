import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function getRestaurant({ params, locals: { supabase } }) {
	const id = Number(params.id);
	if (isNaN(id)) {
		error(400, 'Invalid restaurant id');
	}
	const result = await supabase
		.from('restaurants')
		.select('*, cuisine_restaurants(cuisines(id, name))')
		.eq('id', id)
		.maybeSingle();

	if (result.error) {
		error(result.status, result.error);
	}
	if (!result.data) {
		error(404, 'No restaurants found');
	}
	result.data.cuisines = result.data.cuisine_restaurants.map((cr) => cr.cuisines);
	delete result.data.cuisine_restaurants;
	return new Response(JSON.stringify(result.data));
};
