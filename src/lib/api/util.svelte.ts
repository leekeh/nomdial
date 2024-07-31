import type { PostgrestError } from '@supabase/supabase-js';
import type { LoadEvent } from '@sveltejs/kit';
import type { Schema } from 'zod';

export class FetchState<T> {
	data: T | null = $state(null);
	error: PostgrestError | unknown | null = $state(null);
	hasError = $state(false);
	isLoading = $state(false);
}

export type Fetch = LoadEvent['fetch'];

/**
 * Sync API call that will be executed on the client side.
 * Returns a runes object with the data, error, hasError, and isLoading properties.
 */
export function APICall<T>(path: string, config: RequestInit, schema: Schema<T>): FetchState<T> {
	const result = new FetchState<T>();
	async function fetchData() {
		result.isLoading = true;
		try {
			const response = await fetch(`/api/${path}`, config);
			if (!response.ok) throw new Error(response.statusText);
			result.data = await response.json();
			schema.parse(result.data);
			result.hasError = false;
		} catch (err) {
			result.error = err;
			console.log(typeof err);
			result.hasError = true;
			result.data = null;
		}
		result.isLoading = false;
	}
	fetchData();
	return result;
}

/**
 * Async API call that will be executed on the server side.
 */
export async function asyncAPICall<T>(
	path: RequestInfo,
	config: RequestInit,
	schema: Schema<T>,
	fetchMethod: Fetch
): Promise<FetchState<T>> {
	try {
		const response = await fetchMethod(`/api/${path}`, config);

		if (!response.ok) throw new Error(response.statusText);

		const data: T = await response.json();
		schema.parse(data);
		return {
			data,
			error: null,
			hasError: true,
			isLoading: false
		};
	} catch (error) {
		return {
			data: null,
			error: JSON.stringify(error),
			hasError: true,
			isLoading: false
		};
	}
}
