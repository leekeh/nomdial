import { getLocationFromIp, getRestaurants } from 'api';
import { getAvailableCuisines } from 'api/cuisines.js';

export async function load(evt) {
	const clientLocation = await getLocationFromIp(evt);
	const [restaurants, availableCuisines] = await Promise.all([
		getRestaurants(clientLocation?.coordinates),
		getAvailableCuisines()
	]);

	return {
		restaurants,
		availableCuisines,
		clientLocation
	};
}
