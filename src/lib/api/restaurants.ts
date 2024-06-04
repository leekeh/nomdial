import { supabase } from 'db';

type getRestaurantsProps = {
	lat: number;
	lon: number;
	cuisineIds?: number[];
};

export async function getRestaurants({ lat, lon, cuisineIds }: getRestaurantsProps) {
	return (
		(
			await supabase.rpc('nearby_restaurants', {
				lat: +lat,
				lon: +lon,
				cuisine_filter: cuisineIds?.join()
			})
		).data ?? []
	);
}
