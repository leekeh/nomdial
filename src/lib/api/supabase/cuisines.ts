import { supabase } from 'db';
import { useSupabase, type Config } from './util.svelte';

const myfunct = () => console.log('hiiii');

globalThis.myFunct = myfunct;

export function getAvailableCuisines(config?: Config) {
	return useSupabase(async () => await supabase.from('cuisines').select('name, id'), config);
}
