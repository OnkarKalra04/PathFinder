import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We export a dummy client or a proxy that throws on any method call
  // to prevent "Failed to fetch" from a placeholder URL.
  console.error('Supabase credentials missing! Please update your .env file with actual VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
