import { getCuisinesAsync } from 'api';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals: { safeGetSession }, cookies }) => {
	const cuisines = await getCuisinesAsync(fetch);

	const { session, user } = await safeGetSession();

	return {
		cuisines,
		session,
		user,
		cookies: cookies.getAll()
	};
};
