import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from 'db/supabase.model';
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>; // Your type here
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
