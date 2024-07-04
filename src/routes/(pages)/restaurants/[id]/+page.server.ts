import { getLocationFromIp, getRestaurants } from 'api';
import { getAvailableCuisines } from 'api';

export async function load(evt) {
	const clientLocation = await getLocationFromIp(evt);
	const [restaurants, availableCuisines] = await Promise.all([
		getRestaurants(clientLocation?.coordinates, { awaitable: true }),
		getAvailableCuisines({ awaitable: true })
	]);
	return {
		restaurants,
		availableCuisines,
		clientLocation
	};
}
