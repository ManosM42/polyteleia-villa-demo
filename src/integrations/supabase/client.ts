import { createClient } from "@supabase/supabase-js";

// This grabs your keys from the .env file dynamically
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key env variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);