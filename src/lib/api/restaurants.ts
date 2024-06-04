import { supabase } from 'db';

type getRestaurantsProps = {
	lat: number;
	lon: number;
};

export async function getRestaurants({ lat, lon }: getRestaurantsProps) {
	const data = (await supabase.rpc('nearby_restaurants', { lat: +lat, lon: +lon })).data;
	console.log(data);
	return data;
}
