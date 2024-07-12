import { getLocationFromIpAsync, getRestaurantsByLocationAsync, getCuisinesAsync } from 'api';

const defaultLocation = {
	city: 'Utrecht',
	lat: 52.0907,
	lon: 5.1214
};

export async function load({ getClientAddress, fetch }) {
	const clientLocation = await getLocationFromIpAsync(getClientAddress(), fetch);
	const estimatedLocation = clientLocation.data || defaultLocation;
	const [restaurants, availableCuisines] = await Promise.all([
		getRestaurantsByLocationAsync(estimatedLocation, fetch),
		getCuisinesAsync(fetch)
	]);
	return {
		restaurants,
		availableCuisines,
		estimatedLocation
	};
}
