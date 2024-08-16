import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function getRestaurant({ params, locals: { supabase } }) {
	const id = Number(params.id);
	if (isNaN(id)) {
		error(400, 'Invalid restaurant id');
	}
	const result = await supabase.from('restaurants').select().eq('id', id).maybeSingle();

	if (result.error) {
		error(result.status, result.error);
	}
	if (!result.data) {
		error(404, 'No restaurants found');
	}
	return new Response(JSON.stringify(result.data));
};
