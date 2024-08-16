import type { Cuisines } from 'api';
import { writable } from 'svelte/store';

export const cuisinesStore = writable<Cuisines>([]);
