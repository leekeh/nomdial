import { error, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const GET: RequestHandler = async function getLocationFromIP({ request, fetch }) {
	const userIP = request.headers.get('x-forwarded-for');
	try {
		if (!userIP || userIP === '::1') {
			error(400, 'Invalid user IP');
		}
		const schema = z.object({
			lat: z.number(),
			lon: z.number(),
			city: z.string()
		});
		const response = await fetch(`http://ip-api.com/json/${userIP}?fields=city,lat,lon`);
		const result = await response.json().then((data) => schema.parse(data));
		return new Response(JSON.stringify(result));
	} catch (e) {
		error(500, JSON.stringify(e));
	}
};
