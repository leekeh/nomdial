import { supabase } from 'db';
import { useSupabase, type Config } from './util.svelte';

export function getAvailableCuisines(config?: Config) {
	return useSupabase(async () => await supabase.from('cuisines').select('name, id'), config);
}
