import { supabase } from 'db';
import { json } from '@sveltejs/kit';

export async function GET({ params: { lat, lon } }) {
	const data = await supabase.rpc('nearby_restaurants', { lat: +lat, lon: +lon });
	return json(data);
}
