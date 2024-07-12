import { error } from '@sveltejs/kit';
import { getRestaurantByIdAsync } from 'api';

export async function load({ params: { id }, fetch }) {
	if (!id || isNaN(+id)) {
		error(400, 'Invalid url');
	}
	const restaurant = await getRestaurantByIdAsync(+id, fetch);

	return {
		restaurant
	};
}
