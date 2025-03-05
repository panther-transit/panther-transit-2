import { createClient } from '@supabase/supabase-js';

// Load Supabase credentials from environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase credentials. Check your .env file.");
}

// Export Supabase client (no default export)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
