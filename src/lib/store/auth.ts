import type {
	Session,
	User,
	SignInWithOAuthCredentials,
	OAuthResponse,
	UserResponse,
	SupabaseClient
} from '@supabase/supabase-js';
import { writable } from 'svelte/store';

type AuthStore = {
	session: Session | null;
	user: User | null;
	auth?: SupabaseClient['auth'];
};

export const authStore = writable<AuthStore>({
	session: null,
	user: null
});
