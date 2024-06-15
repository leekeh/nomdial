import type { PostgrestError } from '@supabase/supabase-js';

class FetchState<T> {
	data: T | null = $state(null);
	error: PostgrestError | unknown | null = $state(null);
	hasError = $state(false);
	isLoading = $state(false);
}

export type Config = {
	awaitable: boolean;
};

/**
 * Hybrid wrapper that returns a promise if awaitable is true,
 *  otherwise it returns a FetchState object.
 * This way, we can await the result of the callback if we want to (on the server),
 * or we can use the FetchState object to track the state of the request (on the client).
 */
export function useSupabase<T>(
	callback: () => Promise<{ data: T; error: PostgrestError | null }>,
	{ awaitable }: Config = { awaitable: false }
) {
	if (awaitable) {
		return (async () => {
			const result = await callback();
			const returnVal = {
				data: result.data,
				error: result.error,
				hasError: result.error !== null,
				isLoading: false
			};
			return returnVal;
		})();
	} else {
		const result = new FetchState<T>();
		async function fetchData() {
			result.isLoading = true;
			try {
				const response = await callback();
				result.data = response.data;
				result.error = response.error;
				result.hasError = response.error !== null;
			} catch (err) {
				result.error = err;
				result.hasError = true;
				result.data = null;
			}
			result.isLoading = false;
		}
		fetchData();
		return result;
	}
}
