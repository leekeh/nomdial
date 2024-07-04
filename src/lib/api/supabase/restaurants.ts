import { supabase } from 'db';
import { useSupabase, type Config } from './util.svelte';
import type { Database } from 'db/supabase.model';

type getRestaurantsProps = {
	lat: number;
	lon: number;
	cuisineIds?: number[];
};

export function getRestaurants({ lat, lon, cuisineIds }: getRestaurantsProps, config?: Config) {
	return useSupabase(
		async () =>
			await supabase.rpc('nearby_restaurants', {
				lat: +lat,
				lon: +lon,
				cuisine_filter: cuisineIds?.join()
			}),
		config
	);
}

export type Restaurants = Database['public']['Functions']['nearby_restaurants']['Returns'];
