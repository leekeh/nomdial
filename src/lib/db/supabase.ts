import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.model';

export const projectId = import.meta.env.CLIENT_SUPABASE_PROJECT_ID;
export const anonKey = import.meta.env.CLIENT_SUPABASE_API_KEY;
export const url = `https://${projectId}.supabase.co`;

export const supabase = createClient<Database>(url, anonKey);
