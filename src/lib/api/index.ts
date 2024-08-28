export { type Restaurant, getRestaurantById, getRestaurantByIdAsync } from './restaurant';
export { type Cuisines, getCuisines, getCuisinesAsync } from './cuisines';
export {
	type RestaurantsByLocation,
	getRestaurantsByLocation,
	getRestaurantsByLocationAsync
} from './restaurantsByLocation';
export { type Location, getLocationFromIP, getLocationFromIPAsync } from './locations';
export { type CoordinateResult, getCoordinates, getCoordinatesAsync } from './coordinates';

export { FetchState } from './util.svelte';
