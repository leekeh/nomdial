import { getCuisinesAsync } from 'api';

export async function load({ fetch }) {
	const cuisines = await getCuisinesAsync(fetch);

	return {
		cuisines
	};
}
