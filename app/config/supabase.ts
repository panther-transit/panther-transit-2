import { createClient } from '@supabase/supabase-js';

// Use Expo environment variables for the frontend
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;


if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase credentials. Check your .env file.or hardcore them temporarily.");
}

// Create Supabase client for the frontend
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
