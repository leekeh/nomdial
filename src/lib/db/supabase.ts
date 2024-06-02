import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.model';

const projectId = import.meta.env.CLIENT_SUPABASE_PROJECT_ID;
const anonKey = import.meta.env.CLIENT_SUPABASE_API_KEY;
const url = `https://${projectId}.supabase.co`;

export const supabase = createClient<Database>(url, anonKey);
