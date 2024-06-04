import { supabase } from 'db';

export async function getAvailableCuisines() {
	return (await supabase.from('cuisines').select('name, id')).data ?? [];
}
