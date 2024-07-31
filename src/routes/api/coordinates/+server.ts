import { createServerClient } from '@supabase/ssr';
import { error, type RequestHandler } from '@sveltejs/kit';
import { url } from 'db';
import { SUPABASE_API_KEY, OPEN_WEATHER_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async function getCoordinates({ url: requestUrl, fetch }) {
	//Sanitize query to prevent security issues
	const query = requestUrl.searchParams.get('query')?.replace(/[^\p{L}\d]/gu, '');

	if (!query) {
		error(400, 'Query missing');
	}

	const supabaseAdmin = createServerClient(url, SUPABASE_API_KEY, {
		global: {
			fetch
		},
		cookies: {
			getAll() {
				return null;
			}
		}
	});

	const cachedResult = await supabaseAdmin
		.from('geocoding-cache')
		.select('result')
		.eq('query', query)
		.maybeSingle();

	if (!cachedResult.error && cachedResult.data) {
		return new Response(JSON.stringify(cachedResult.data.result));
	}

	const result = await fetch(
		`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${OPEN_WEATHER_API_KEY}`
	);

	if (result.ok) {
		const data = await result.json();
		if (!data || data.length === 0) {
			error(404, 'No locations found');
		}
		// Remove local_names to save bandwidth and storage
		const filteredData = data.map(
			({ lat, lon, country, state, name }: Record<string, unknown>) => ({
				lat,
				lon,
				country,
				state,
				name
			})
		);
		await supabaseAdmin.from('geocoding-cache').insert({ query: query, result: filteredData });
		return new Response(JSON.stringify(filteredData));
	}

	error(500, 'Failed to get locations');
};
