import { error, type RequestHandler } from '@sveltejs/kit';
import { supabase } from 'db';

export const GET: RequestHandler = async function getCuisines() {
	const result = await supabase.from('cuisines').select('name, id');

	if (result.error) {
		error(result.status, result.error);
	}
	if (!result.data.length) {
		error(404, 'No cuisines found');
	}
	return new Response(JSON.stringify(result.data));
};
